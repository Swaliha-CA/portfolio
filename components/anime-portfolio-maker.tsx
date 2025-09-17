"use client"

import { useState } from "react"
import { PhotoUpload } from "./photo-upload"
import { UserInfoForm } from "./user-info-form"
import { SearchableAnimeSelector } from "./searchable-anime-selector"
import { PortfolioGenerator } from "./portfolio-generator"
import { Card } from "./ui/card"
import { Sparkles, Star, Heart, User, Wand2 } from "lucide-react"
import { Badge } from "./ui/badge"

interface UserData {
  name: string
  age: string
  school: string
  interests: string[]
  skills: string[]
  bio: string
  photo?: File
  animeStyle: string
  animeCharacter?: string
  selectedAnime?: string
  selectedCharacter?: string
  characterName?: string
  characterDescription?: string
}

export function AnimePortfolioMaker() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: "",
    school: "",
    interests: [],
    skills: [],
    bio: "",
    animeStyle: "shonen",
    animeCharacter: undefined,
    selectedAnime: undefined,
    selectedCharacter: undefined,
    characterName: undefined,
    characterDescription: undefined,
  })
  const [generatedPortfolio, setGeneratedPortfolio] = useState<string | null>(null)

  const steps = [
    { id: 1, title: "Upload Photo", icon: Star, desc: "Add your photo" },
    { id: 2, title: "Your Info", icon: Heart, desc: "Tell us about you" },
    { id: 3, title: "Pick Anime", icon: User, desc: "Choose favorite anime" },
    { id: 4, title: "Generate!", icon: Wand2, desc: "Create portfolio" },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-sparkle opacity-40">⭐</div>
        <div
          className="absolute top-40 right-20 text-3xl animate-sparkle opacity-40"
          style={{ animationDelay: "0.5s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-20 left-20 text-3xl animate-sparkle opacity-40"
          style={{ animationDelay: "1s" }}
        >
          🌟
        </div>
        <div
          className="absolute bottom-40 right-10 text-4xl animate-sparkle opacity-40"
          style={{ animationDelay: "1.5s" }}
        >
          💫
        </div>
        <div className="absolute top-1/2 left-1/4 text-2xl animate-float opacity-30" style={{ animationDelay: "2s" }}>
          🎭
        </div>
        <div
          className="absolute top-1/3 right-1/3 text-2xl animate-float opacity-30"
          style={{ animationDelay: "2.5s" }}
        >
          🎨
        </div>
        <div
          className="absolute bottom-1/3 left-1/2 text-2xl animate-float opacity-30"
          style={{ animationDelay: "3s" }}
        >
          ⚡
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-gradient-animate mb-4 animate-bounce-in">
          ✨ Anime Portfolio Maker ✨
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-up">
          Transform yourself into an anime character and create the coolest portfolio ever! Perfect for students who
          want to stand out! 🌟
        </p>
        <div className="mt-4 flex justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Badge variant="secondary" className="animate-float">
            🎯 For Students
          </Badge>
          <Badge variant="secondary" className="animate-float" style={{ animationDelay: "0.2s" }}>
            🤖 AI Powered
          </Badge>
          <Badge variant="secondary" className="animate-float" style={{ animationDelay: "0.4s" }}>
            🎨 Anime Style
          </Badge>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="flex items-center space-x-2 md:space-x-4 bg-card/50 backdrop-blur-sm rounded-full p-4 border border-primary/20 animate-glow">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 transform
                    ${isActive ? "bg-primary text-primary-foreground border-primary animate-pulse-glow scale-110" : ""}
                    ${isCompleted ? "bg-secondary text-secondary-foreground border-secondary animate-glow" : ""}
                    ${!isActive && !isCompleted ? "bg-muted text-muted-foreground border-border hover:scale-105" : ""}
                  `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden md:block">{step.desc}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 md:mx-4 transition-all duration-500 ${isCompleted ? "bg-secondary animate-shimmer" : "bg-border"}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-4xl mx-auto portfolio-card shadow-2xl border-2 border-primary/20 animate-slide-in-up relative z-10">
        <div className="p-6 md:p-8">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <PhotoUpload userData={userData} setUserData={setUserData} onNext={handleNext} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-slide-in-up">
              <UserInfoForm userData={userData} setUserData={setUserData} onNext={handleNext} onBack={handleBack} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-slide-in-up">
              <SearchableAnimeSelector
                userData={userData}
                setUserData={setUserData}
                onNext={handleNext}
                onBack={handleBack}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-slide-in-up">
              <PortfolioGenerator
                userData={userData}
                generatedPortfolio={generatedPortfolio}
                setGeneratedPortfolio={setGeneratedPortfolio}
                onBack={handleBack}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Fun Stats Display */}
      {currentStep > 1 && (
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10 animate-float">
              <div className="text-2xl font-bold text-primary">{userData.name ? "✓" : "○"}</div>
              <div className="text-xs text-muted-foreground">Name Set</div>
            </div>
            <div
              className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10 animate-float"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-2xl font-bold text-primary">{userData.interests.length}</div>
              <div className="text-xs text-muted-foreground">Interests</div>
            </div>
            <div
              className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10 animate-float"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-2xl font-bold text-primary">{userData.selectedAnime ? "✓" : "○"}</div>
              <div className="text-xs text-muted-foreground">Anime Chosen</div>
            </div>
            <div
              className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10 animate-float"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-2xl font-bold text-primary">{userData.selectedCharacter ? "✓" : "○"}</div>
              <div className="text-xs text-muted-foreground">Character Set</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Hint */}
      {currentStep < 4 && (
        <div className="fixed bottom-8 right-8 animate-bounce-in z-20">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg animate-glow">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Step {currentStep} of 4</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
