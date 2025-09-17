import { type NextRequest, NextResponse } from "next/server"

async function callGeminiWithRetry(prompt: string, apiKey: string, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.9,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
        console.error(`Gemini API Error (attempt ${attempt}):`, errorData)

        // If it's a 503 (overloaded) error and we have retries left, wait and try again
        if (response.status === 503 && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff: 2s, 4s, 8s
          console.log(`Model overloaded, retrying in ${waitTime}ms...`)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }

        // Return the actual error for the final attempt
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      // Wait before retrying on network errors
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    const characterInfo = userData.animeCharacter ? `\n- Chosen Character Type: ${userData.animeCharacter}` : ""

    const prompt = `
You are an expert anime character creator and portfolio writer. Create a funny, engaging, and creative anime-style portfolio for a high school student that transforms them into an amazing anime character.

Student Information:
- Name: ${userData.name}
- Age: ${userData.age}
- School: ${userData.school}
- Bio: ${userData.bio}
- Interests: ${userData.interests.join(", ")}
- Skills: ${userData.skills.join(", ")}
- Chosen Anime Style: ${userData.animeStyle}${characterInfo}

Create a portfolio that completely transforms this student into an anime character with these sections:

🌟 **ANIME CHARACTER PROFILE**
Transform their appearance into a detailed anime character description matching the ${userData.animeStyle} style${userData.animeCharacter ? ` as a ${userData.animeCharacter}` : ""}. Include:
- Hair color, style, and special features
- Eye color and unique characteristics
- Outfit/uniform design
- Any special markings, accessories, or distinctive features
- Overall aesthetic that matches their personality

⚡ **SPECIAL ABILITIES & POWERS**
Based on their interests and skills, create 4-6 unique anime-style abilities:
- Give each power a cool Japanese-inspired name
- Explain how each power relates to their real skills/interests
- Include power levels and special techniques
- Add funny limitations or quirks to each ability

📖 **CHARACTER BACKSTORY**
Write an engaging origin story that:
- Incorporates their real school and interests into an anime world
- Explains how they discovered their powers
- Includes a memorable mentor or rival character
- Sets up their main goal or quest

📊 **CHARACTER STATS** (Rate 1-10)
- Strength: [based on physical activities/sports]
- Intelligence: [based on academic interests]
- Creativity: [based on artistic/creative skills]
- Charisma: [based on social activities]
- Magic Power: [based on unique interests]
- Determination: [based on their personality]

🎭 **SIGNATURE MOVES & TECHNIQUES**
Create 3-4 special attacks or techniques with:
- Epic names in Japanese style
- Detailed descriptions of what they do
- Funny sound effects (like "WHOOOOSH!" or "SPARKLE BEAM!")

💬 **ICONIC QUOTES**
Generate 4-5 memorable quotes this character would say:
- Include their catchphrase
- Battle cry
- Motivational quote
- Funny everyday quote
- Dramatic moment quote

🏫 **SCHOOL LIFE ANIME STYLE**
Describe their anime school experience:
- What special club or organization they'd join
- Their unique school uniform modifications
- Relationship with classmates and teachers
- School festival or competition they'd participate in

🎯 **ULTIMATE GOAL & DREAM**
What is their main quest or dream in the anime world? Make it epic and tied to their real interests!

Make this incredibly fun, creative, and full of anime tropes while staying true to their personality. Use lots of emojis, exciting language, and make them feel like the main character of their own anime series!

Format it as an exciting character profile that reads like it's from an official anime guidebook.
`

    const data = await callGeminiWithRetry(prompt, geminiApiKey)
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      return NextResponse.json(
        { error: "No content generated from Gemini AI. The response may have been filtered by safety settings." },
        { status: 500 },
      )
    }

    return NextResponse.json({ portfolio: generatedText })
  } catch (error) {
    console.error("Error generating portfolio:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    if (errorMessage.includes("overloaded")) {
      return NextResponse.json(
        { error: "The AI model is currently overloaded. Please try again in a few moments!" },
        { status: 503 },
      )
    } else if (errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Gemini API key configuration." },
        { status: 401 },
      )
    } else {
      return NextResponse.json({ error: `Failed to generate portfolio: ${errorMessage}` }, { status: 500 })
    }
  }
}
