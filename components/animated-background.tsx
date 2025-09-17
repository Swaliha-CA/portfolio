"use client"

import { useEffect, useState } from "react"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  emoji: string
  duration: number
  delay: number
  rotation: number
  direction: number
}

export function AnimatedBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    const animeEmojis = ["⭐", "✨", "🌟", "💫", "🎌", "🌸", "🎭", "🎨", "🎪", "🎯", "⚡", "🔥", "💎", "🌈", "🎊"]

    const newElements: FloatingElement[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 15,
      emoji: animeEmojis[Math.floor(Math.random() * animeEmojis.length)],
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      direction: Math.random() > 0.5 ? 1 : -1,
    }))

    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse" />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-float opacity-30" />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-float opacity-30"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl animate-float opacity-20"
        style={{ animationDelay: "4s" }}
      />

      {/* Enhanced floating elements */}
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-float opacity-25 hover:opacity-40 transition-opacity duration-300"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
            transform: `rotate(${element.rotation}deg)`,
            filter: `hue-rotate(${element.direction * 30}deg)`,
          }}
        >
          <div
            className="animate-sparkle"
            style={{
              animationDuration: `${element.duration * 0.5}s`,
              animationDelay: `${element.delay * 0.5}s`,
            }}
          >
            {element.emoji}
          </div>
        </div>
      ))}

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-shimmer" />
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-secondary/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-shimmer"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  )
}
