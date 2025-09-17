import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyALXdSR8QobIwF_1TPFF9R8Gn8Yq-IQm8w")

const MODELS = ["gemini-1.5-flash", "gemini-1.5-pro"] // Primary and fallback models

async function retryWithBackoff<T>(
  fn: (modelName: string) => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  let currentModelIndex = 0

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const modelName = MODELS[currentModelIndex % MODELS.length]
      console.log(`[v0] Attempting with model: ${modelName} (attempt ${attempt + 1}/${maxRetries})`)
      return await fn(modelName)
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1
      const isRetryableError =
        error?.message?.includes("503") ||
        error?.message?.includes("overloaded") ||
        error?.message?.includes("429") || // Rate limit
        error?.message?.includes("500") // Server error

      if (isLastAttempt) {
        throw error
      }

      if (isRetryableError) {
        if (error?.message?.includes("503") || error?.message?.includes("overloaded")) {
          currentModelIndex++
          console.log(`[v0] Model overloaded, switching to: ${MODELS[currentModelIndex % MODELS.length]}`)
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 1000, 30000)
        console.log(`[v0] API error (${error?.message?.split(":")[0]}), retrying in ${Math.round(delay)}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        // Non-retryable error, throw immediately
        throw error
      }
    }
  }
  throw new Error("Max retries exceeded")
}

function generateSVGAvatar(characterName: string, animeStyle: string): string {
  // Character-specific color schemes
  const characterColors = {
    // Pokemon
    Pikachu: { primary: "#ffeb3b", secondary: "#ff5722", accent: "#2196f3" },
    "Ash Ketchum": { primary: "#2196f3", secondary: "#ff5722", accent: "#4caf50" },
    Charizard: { primary: "#ff5722", secondary: "#ff9800", accent: "#795548" },
    Bulbasaur: { primary: "#4caf50", secondary: "#8bc34a", accent: "#ff5722" },

    // Naruto
    Naruto: { primary: "#ff9800", secondary: "#2196f3", accent: "#ffeb3b" },
    Sasuke: { primary: "#3f51b5", secondary: "#9c27b0", accent: "#607d8b" },
    Sakura: { primary: "#e91e63", secondary: "#4caf50", accent: "#ffeb3b" },
    Kakashi: { primary: "#607d8b", secondary: "#9e9e9e", accent: "#2196f3" },

    // Dragon Ball
    Goku: { primary: "#ff9800", secondary: "#2196f3", accent: "#ffeb3b" },
    Vegeta: { primary: "#3f51b5", secondary: "#ffeb3b", accent: "#9c27b0" },
    Gohan: { primary: "#ff9800", secondary: "#4caf50", accent: "#2196f3" },

    // One Piece
    Luffy: { primary: "#f44336", secondary: "#ffeb3b", accent: "#2196f3" },
    Zoro: { primary: "#4caf50", secondary: "#795548", accent: "#607d8b" },
    Nami: { primary: "#ff9800", secondary: "#2196f3", accent: "#ffeb3b" },
    Sanji: { primary: "#ffeb3b", secondary: "#795548", accent: "#2196f3" },

    // My Hero Academia
    Deku: { primary: "#4caf50", secondary: "#f44336", accent: "#ffeb3b" },
    Bakugo: { primary: "#ff9800", secondary: "#f44336", accent: "#795548" },
    "Katsuki Bakugo": { primary: "#ff9800", secondary: "#f44336", accent: "#795548" },
    Todoroki: { primary: "#2196f3", secondary: "#f44336", accent: "#9e9e9e" },

    // Attack on Titan
    Eren: { primary: "#795548", secondary: "#4caf50", accent: "#f44336" },
    Mikasa: { primary: "#f44336", secondary: "#9e9e9e", accent: "#795548" },
    Armin: { primary: "#ffeb3b", secondary: "#2196f3", accent: "#9e9e9e" },

    // Demon Slayer
    Tanjiro: { primary: "#4caf50", secondary: "#f44336", accent: "#795548" },
    Nezuko: { primary: "#e91e63", secondary: "#ff9800", accent: "#4caf50" },
    Zenitsu: { primary: "#ffeb3b", secondary: "#ff9800", accent: "#2196f3" },
    Inosuke: { primary: "#795548", secondary: "#4caf50", accent: "#ff9800" },
  }

  // Get character colors or use style-based fallback
  let colors = characterColors[characterName as keyof typeof characterColors]

  if (!colors) {
    // Style-based color schemes for unknown characters
    const styleColors = {
      shonen: { primary: "#ff5722", secondary: "#2196f3", accent: "#ffeb3b" },
      shoujo: { primary: "#e91e63", secondary: "#9c27b0", accent: "#ffeb3b" },
      seinen: { primary: "#607d8b", secondary: "#795548", accent: "#ff9800" },
      josei: { primary: "#9c27b0", secondary: "#e91e63", accent: "#4caf50" },
      mecha: { primary: "#607d8b", secondary: "#2196f3", accent: "#ff9800" },
      "slice-of-life": { primary: "#4caf50", secondary: "#ffeb3b", accent: "#2196f3" },
      fantasy: { primary: "#9c27b0", secondary: "#4caf50", accent: "#ff9800" },
      "sci-fi": { primary: "#2196f3", secondary: "#607d8b", accent: "#ffeb3b" },
    }

    colors = styleColors[animeStyle as keyof typeof styleColors] || styleColors.shonen
  }

  // Generate SVG avatar
  const svg = `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#bg)" />
      <circle cx="60" cy="45" r="20" fill="${colors.accent}" opacity="0.9" />
      <circle cx="50" cy="40" r="3" fill="#000" />
      <circle cx="70" cy="40" r="3" fill="#000" />
      <path d="M 50 50 Q 60 55 70 50" stroke="#000" strokeWidth="2" fill="none" />
      <text x="60" y="85" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#000" opacity="0.8">
        ${characterName.length > 12 ? characterName.substring(0, 12) + "..." : characterName}
      </text>
    </svg>
  `

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, characterName, animeStyle, userPhoto } = await request.json()

    console.log("[v0] Generating avatar with enhanced prompt:", prompt)

    try {
      const result = await retryWithBackoff(
        async (modelName: string) => {
          const model = genAI.getGenerativeModel({ model: modelName })
          const enhancedPrompt = `Create a detailed visual description for an anime avatar based on: ${prompt}. 
        Include specific details about hair color, eye color, clothing style, facial features, and pose. 
        Make it vivid and detailed for image generation. Keep it under 200 characters for URL compatibility.`

          return await model.generateContent(enhancedPrompt)
        },
        4,
        1500,
      )

      const description = result.response.text()
      const shortDescription = description
        .slice(0, 150)
        .replace(/[^\w\s-]/g, "")
        .trim()

      const avatarUrl = generateSVGAvatar(characterName, animeStyle)

      console.log("[v0] Avatar generated successfully with AI:", { characterName, animeStyle })

      return NextResponse.json({
        success: true,
        avatarUrl,
        description: shortDescription,
        characterName,
        animeStyle,
        method: "ai-generated",
      })
    } catch (apiError: any) {
      console.log("[v0] AI generation failed after all retries:", {
        error: apiError.message,
        characterName,
        animeStyle,
        fallbackUsed: true,
      })

      const fallbackUrl = generateSVGAvatar(characterName, animeStyle)

      return NextResponse.json({
        success: true,
        avatarUrl: fallbackUrl,
        description: `Fallback avatar for ${characterName} from ${animeStyle}`,
        characterName,
        animeStyle,
        method: "fallback",
        warning: apiError.message.includes("503")
          ? "AI service is temporarily overloaded. Using styled avatar - try again in a few minutes."
          : "AI service temporarily unavailable, using styled avatar",
      })
    }
  } catch (error) {
    console.error("Avatar generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate avatar",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
