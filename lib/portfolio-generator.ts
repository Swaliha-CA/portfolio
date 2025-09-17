export interface UserData {
  name: string
  age: string
  school: string
  interests: string[]
  skills: string[]
  bio: string
  photo?: File
  animeStyle: string
}

export async function generateAnimePortfolio(userData: UserData): Promise<string> {
  try {
    const response = await fetch("/api/generate-portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate portfolio")
    }

    const data = await response.json()
    return data.portfolio
  } catch (error) {
    console.error("Error generating portfolio:", error)
    throw error
  }
}

export function parsePortfolioSections(portfolio: string) {
  // Simple parser to extract different sections from the generated portfolio
  const sections = {
    characterDescription: "",
    backstory: "",
    abilities: "",
    stats: "",
    quotes: "",
    schoolLife: "",
  }

  // Split by common section headers and extract content
  const lines = portfolio.split("\n")
  let currentSection = ""
  let content = ""

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.includes("Character Description") || trimmedLine.includes("Anime Character")) {
      if (currentSection && content) {
        sections[currentSection as keyof typeof sections] = content.trim()
      }
      currentSection = "characterDescription"
      content = ""
    } else if (trimmedLine.includes("Backstory") || trimmedLine.includes("Background")) {
      if (currentSection && content) {
        sections[currentSection as keyof typeof sections] = content.trim()
      }
      currentSection = "backstory"
      content = ""
    } else if (trimmedLine.includes("Abilities") || trimmedLine.includes("Powers")) {
      if (currentSection && content) {
        sections[currentSection as keyof typeof sections] = content.trim()
      }
      currentSection = "abilities"
      content = ""
    } else if (trimmedLine.includes("Stats") || trimmedLine.includes("Statistics")) {
      if (currentSection && content) {
        sections[currentSection as keyof typeof sections] = content.trim()
      }
      currentSection = "stats"
      content = ""
    } else if (trimmedLine.includes("Quotes") || trimmedLine.includes("Catchphrases")) {
      if (currentSection && content) {
        sections[currentSection as keyof typeof sections] = content.trim()
      }
      currentSection = "quotes"
      content = ""
    } else if (trimmedLine.includes("School") || trimmedLine.includes("Academic")) {
      if (currentSection && content) {
        sections[currentSection as keyof typeof sections] = content.trim()
      }
      currentSection = "schoolLife"
      content = ""
    } else if (trimmedLine && !trimmedLine.startsWith("#") && !trimmedLine.startsWith("**")) {
      content += line + "\n"
    }
  }

  // Don't forget the last section
  if (currentSection && content) {
    sections[currentSection as keyof typeof sections] = content.trim()
  }

  return sections
}
