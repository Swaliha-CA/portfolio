"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { generateAnimePortfolio } from "@/lib/portfolio-generator"
import { Sparkles, ArrowLeft, Download, Share2, Wand2, Loader2, Copy, Check, Zap, RefreshCw } from "lucide-react"
import Image from "next/image"

interface PortfolioGeneratorProps {
  userData: any
  generatedPortfolio: string | null
  setGeneratedPortfolio: (portfolio: string | null) => void
  onBack: () => void
}

export function PortfolioGenerator({
  userData,
  generatedPortfolio,
  setGeneratedPortfolio,
  onBack,
}: PortfolioGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [avatarWarning, setAvatarWarning] = useState<string | null>(null)
  const [avatarMethod, setAvatarMethod] = useState<"ai-generated" | "fallback" | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const portfolio = await generateAnimePortfolio(userData)
      setGeneratedPortfolio(portfolio)
      await generateAvatar()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate portfolio")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAvatar = async () => {
    setIsGeneratingAvatar(true)
    setAvatarWarning(null)
    try {
      let avatarPrompt = ""

      if (userData.characterName && userData.characterDescription) {
        avatarPrompt = `${userData.characterDescription}, ${userData.animeStyle || "anime"} style, high quality digital art, detailed anime portrait, expressive eyes, vibrant colors`
      } else {
        const characterDetails = userData.animeCharacter ? ` as ${userData.animeCharacter} character` : ""
        const styleDetails = userData.animeStyle || "modern anime"
        const personalityTraits = userData.interests.slice(0, 3).join(", ")
        avatarPrompt = `${styleDetails} style anime character${characterDetails}, ${userData.age} year old student, interested in ${personalityTraits}, high quality digital art, colorful, expressive eyes, detailed hair, anime portrait`
      }

      console.log("[v0] Generating avatar with enhanced prompt:", avatarPrompt)

      const response = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: avatarPrompt,
          characterName: userData.characterName,
          animeStyle: userData.animeStyle,
          userPhoto: userData.photo ? await convertFileToBase64(userData.photo) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate avatar")
      }

      const data = await response.json()

      if (data.success && data.avatarUrl) {
        setGeneratedAvatar(data.avatarUrl)
        setAvatarMethod(data.method || "ai-generated")
        if (data.warning) {
          setAvatarWarning(data.warning)
        }
        console.log("[v0] Avatar generated successfully with method:", data.method)
      } else {
        throw new Error(data.error || "Avatar generation failed")
      }
    } catch (err) {
      console.error("[v0] Avatar generation failed:", err)
      const fallbackUrl = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(`anime character portrait ${userData.animeStyle || "modern anime"} style`)}`

      setGeneratedAvatar(fallbackUrl)
      setAvatarMethod("fallback")
      setAvatarWarning("Avatar generation service is temporarily unavailable")
    } finally {
      setIsGeneratingAvatar(false)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleCopy = async () => {
    if (generatedPortfolio) {
      await navigator.clipboard.writeText(generatedPortfolio)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedPortfolio) {
      const blob = new Blob([generatedPortfolio], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${userData.name}-anime-portfolio.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleShare = async () => {
    if (navigator.share && generatedPortfolio) {
      try {
        await navigator.share({
          title: `${userData.name}'s Anime Portfolio`,
          text: generatedPortfolio,
        })
      } catch (err) {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  const photoUrl = userData.photo ? URL.createObjectURL(userData.photo) : null

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Wand2 className="w-8 h-8" />
          Generate Your Anime Portfolio
        </h2>
        <p className="text-muted-foreground text-lg">
          Ready to see yourself as an amazing anime character? Let's create your unique portfolio! ✨
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 animate-glow">
        <div className="flex items-start gap-6">
          <div className="flex flex-col gap-4">
            {photoUrl && (
              <div className="relative">
                <div className="text-center mb-2">
                  <Badge variant="outline" className="text-xs">
                    Original Photo
                  </Badge>
                </div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 animate-glow">
                  <Image
                    src={photoUrl || "/placeholder.svg"}
                    alt="User photo"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
            )}

            {generatedAvatar && (
              <div className="relative">
                <div className="text-center mb-2">
                  <Badge
                    className={`text-xs animate-glow ${
                      avatarMethod === "ai-generated"
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-gradient-to-r from-orange-500 to-yellow-500"
                    }`}
                  >
                    {avatarMethod === "ai-generated" ? "✨ AI Avatar" : "🎨 Fallback Avatar"}
                  </Badge>
                  {avatarWarning && (
                    <div className="text-xs text-orange-600 mt-1 max-w-24 text-center">
                      {avatarWarning.includes("overloaded") ? "AI busy, retrying..." : "Using backup"}
                    </div>
                  )}
                </div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary animate-pulse-glow avatar-container">
                  <Image
                    src={generatedAvatar || "/placeholder.svg"}
                    alt="Generated anime avatar"
                    fill
                    className="object-cover transition-all duration-500 hover:scale-110"
                    sizes="96px"
                    onLoad={() => console.log("[v0] Avatar image loaded successfully")}
                    onError={(e) => {
                      const errorMsg = e.currentTarget?.src
                        ? `Failed to load: ${e.currentTarget.src}`
                        : "Image load failed"
                      console.error("[v0] Avatar image failed to load:", errorMsg)
                      setGeneratedAvatar(
                        `/placeholder.svg?height=400&width=400&query=${encodeURIComponent("anime character error fallback")}`,
                      )
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-secondary/20" />
                </div>
              </div>
            )}

            {isGeneratingAvatar && (
              <div className="relative">
                <div className="text-center mb-2">
                  <Badge variant="outline" className="text-xs animate-shimmer">
                    🎨 Creating Avatar...
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">AI may retry if busy</div>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse-glow">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="w-6 h-6 text-secondary opacity-75" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-primary mb-2">{userData.name}</h3>
            <p className="text-muted-foreground mb-3">{userData.bio}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {userData.interests.slice(0, 3).map((interest: string) => (
                <Badge key={interest} variant="secondary" className="animate-float">
                  {interest}
                </Badge>
              ))}
              {userData.interests.length > 3 && <Badge variant="outline">+{userData.interests.length - 3} more</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Age: {userData.age}</span>
              <span>•</span>
              <span>{userData.school}</span>
              {userData.selectedAnime && (
                <>
                  <span>•</span>
                  <span className="capitalize">{userData.selectedAnime.replace("-", " ")}</span>
                </>
              )}
              {userData.characterName && (
                <>
                  <span>•</span>
                  <span>{userData.characterName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {!generatedPortfolio && (
        <div className="text-center">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="px-12 py-4 text-xl font-bold animate-glow hover:scale-105 transition-transform"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Creating Your Anime Character...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                Generate My Anime Portfolio!
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="mt-6 space-y-4">
              <div className="text-sm text-muted-foreground">
                Our AI is working its magic to transform you into an anime character...
              </div>

              <div className="flex justify-center items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <Zap className="w-4 h-4 text-primary animate-pulse" />
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="animate-pulse">✨ Analyzing your personality...</div>
                <div className="animate-pulse" style={{ animationDelay: "1s" }}>
                  🎨 Creating your anime avatar...
                </div>
                <div className="animate-pulse" style={{ animationDelay: "2s" }}>
                  📝 Writing your character story...
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">Oops! Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Make sure you have:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Added your GEMINI_API_KEY to the environment variables</li>
                <li>A stable internet connection</li>
                <li>Valid API key with sufficient quota</li>
              </ul>
            </div>
            <Button onClick={handleGenerate} className="mt-4">
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {generatedPortfolio && (
        <div className="space-y-6">
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="animate-float bg-transparent hover:scale-105 transition-transform"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="animate-float bg-transparent hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="animate-float bg-transparent hover:scale-105 transition-transform"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={generateAvatar}
              disabled={isGeneratingAvatar}
              variant="outline"
              className="animate-float bg-transparent hover:scale-105 transition-transform"
            >
              {isGeneratingAvatar ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Avatar
                </>
              )}
            </Button>
          </div>

          <Card className="portfolio-card p-8 border-2 border-primary/20 hover:shadow-2xl transition-all duration-500">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gradient-animate mb-2 animate-float">
                  {userData.name}'s Anime Portfolio
                </h1>
                <div className="flex justify-center gap-2 flex-wrap">
                  {userData.selectedAnime && (
                    <Badge className="text-lg px-4 py-1 capitalize animate-glow">
                      {userData.selectedAnime.replace("-", " ")} Fan
                    </Badge>
                  )}
                  {userData.characterName && (
                    <Badge variant="outline" className="text-lg px-4 py-1 animate-glow">
                      Inspired by {userData.characterName}
                    </Badge>
                  )}
                </div>

                {generatedAvatar && (
                  <div className="mt-6 flex justify-center">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary animate-pulse-glow hover:scale-110 transition-transform duration-300 avatar-container">
                      <Image
                        src={generatedAvatar || "/placeholder.svg"}
                        alt="Anime avatar"
                        fill
                        className="object-cover"
                        sizes="160px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-secondary/20" />
                      <div className="absolute inset-0 animate-shimmer opacity-50" />
                    </div>
                    {avatarMethod === "fallback" && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          Backup Avatar
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator className="my-8 animate-glow" />

              <div className="whitespace-pre-wrap text-foreground leading-relaxed animate-fade-in">
                {generatedPortfolio}
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="outline"
              className="animate-float bg-transparent hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Version
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-8 bg-transparent hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {generatedPortfolio && (
          <Button
            onClick={() => window.location.reload()}
            size="lg"
            className="px-8 py-3 text-lg font-semibold animate-float hover:scale-105 transition-transform"
          >
            Create Another Portfolio
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
