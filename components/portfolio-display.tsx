"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Copy, Download, Share2, RefreshCw, Check } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface PortfolioDisplayProps {
  portfolio: string
  userData: any
  generatedAvatar?: string
  onRegenerate: () => void
  onRegenerateAvatar: () => void
  isRegenerating?: boolean
}

export function PortfolioDisplay({
  portfolio,
  userData,
  generatedAvatar,
  onRegenerate,
  onRegenerateAvatar,
  isRegenerating = false,
}: PortfolioDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portfolio)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([portfolio], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${userData.name}-anime-portfolio.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData.name}'s Anime Portfolio`,
          text: portfolio,
        })
      } catch (err) {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
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
          onClick={onRegenerateAvatar}
          variant="outline"
          className="animate-float bg-transparent hover:scale-105 transition-transform"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Avatar
        </Button>
      </div>

      {/* Portfolio Content */}
      <Card className="portfolio-card shadow-2xl border-2 border-primary/20 animate-glow hover:shadow-3xl transition-all duration-500">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-animate mb-4 animate-float">
              {userData.name}'s Anime Portfolio
            </h1>

            <div className="flex justify-center gap-2 flex-wrap mb-6">
              <Badge className="text-lg px-4 py-1 capitalize animate-glow">{userData.animeStyle} Style</Badge>
              {userData.animeCharacter && (
                <Badge variant="outline" className="text-lg px-4 py-1 capitalize animate-float">
                  {userData.animeCharacter}
                </Badge>
              )}
            </div>

            {generatedAvatar && (
              <div className="flex justify-center mb-6">
                <div className="avatar-container relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary animate-pulse-glow hover:scale-110 transition-transform duration-300">
                  <Image
                    src={generatedAvatar || "/placeholder.svg"}
                    alt="Anime avatar"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>
              </div>
            )}
          </div>

          <Separator className="my-8 animate-glow" />

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed animate-fade-in">{portfolio}</div>
          </div>
        </div>
      </Card>

      {/* Regenerate Option */}
      <div className="text-center">
        <Button
          onClick={onRegenerate}
          disabled={isRegenerating}
          variant="outline"
          className="animate-float bg-transparent hover:scale-105 transition-transform"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Version
        </Button>
      </div>
    </div>
  )
}
