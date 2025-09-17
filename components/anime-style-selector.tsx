"use client"

import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Sparkles, ArrowLeft, Zap, Heart, Sword, Star, Sun, User } from "lucide-react"

interface AnimeStyleSelectorProps {
  userData: any
  setUserData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const animeStyles = [
  {
    id: "shonen",
    name: "Shonen",
    description: "Action-packed, energetic, and heroic! Perfect for adventurous spirits.",
    icon: Sword,
    color: "from-orange-400 to-red-500",
    traits: ["Brave", "Determined", "Energetic", "Loyal"],
    examples: "Like Naruto, Dragon Ball, One Piece",
    characters: [
      { id: "hero", name: "Heroic Protagonist", desc: "Spiky hair, determined eyes, bright colors" },
      { id: "warrior", name: "Battle Warrior", desc: "Strong build, battle scars, fierce expression" },
      { id: "ninja", name: "Ninja Fighter", desc: "Masked face, agile pose, dark outfit" },
      { id: "captain", name: "Team Captain", desc: "Leadership aura, confident stance, uniform" },
    ],
  },
  {
    id: "shoujo",
    name: "Shoujo",
    description: "Romantic, elegant, and dreamy! Great for those who love beauty and emotions.",
    icon: Heart,
    color: "from-pink-400 to-purple-500",
    traits: ["Romantic", "Graceful", "Emotional", "Kind"],
    examples: "Like Sailor Moon, Fruits Basket, Ouran",
    characters: [
      { id: "princess", name: "Magical Princess", desc: "Flowing hair, sparkly dress, gentle smile" },
      { id: "student", name: "School Beauty", desc: "Uniform, ribbon, innocent expression" },
      { id: "idol", name: "Pop Idol", desc: "Stage outfit, microphone, bright smile" },
      { id: "noble", name: "Noble Lady", desc: "Elegant dress, refined posture, graceful" },
    ],
  },
  {
    id: "seinen",
    name: "Seinen",
    description: "Mature, sophisticated, and complex! For deep thinkers and realists.",
    icon: Star,
    color: "from-blue-400 to-indigo-600",
    traits: ["Mature", "Thoughtful", "Complex", "Realistic"],
    examples: "Like Attack on Titan, Death Note, Ghost in the Shell",
    characters: [
      { id: "detective", name: "Detective", desc: "Sharp suit, analytical eyes, serious expression" },
      { id: "soldier", name: "Elite Soldier", desc: "Military gear, battle-hardened, tactical pose" },
      { id: "scientist", name: "Researcher", desc: "Lab coat, glasses, thoughtful expression" },
      { id: "executive", name: "Business Executive", desc: "Professional attire, confident stance" },
    ],
  },
  {
    id: "slice-of-life",
    name: "Slice of Life",
    description: "Peaceful, relatable, and heartwarming! Perfect for everyday heroes.",
    icon: Sun,
    color: "from-green-400 to-teal-500",
    traits: ["Peaceful", "Relatable", "Warm", "Genuine"],
    examples: "Like K-On!, Your Name, A Silent Voice",
    characters: [
      { id: "student", name: "Friendly Student", desc: "Casual clothes, warm smile, relaxed pose" },
      { id: "artist", name: "Creative Artist", desc: "Paint-stained apron, artistic tools, inspired look" },
      { id: "chef", name: "Passionate Chef", desc: "Chef hat, apron, cooking utensils" },
      { id: "musician", name: "Street Musician", desc: "Instrument, casual style, passionate expression" },
    ],
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical, mystical, and otherworldly! For dreamers and magic lovers.",
    icon: Sparkles,
    color: "from-purple-400 to-pink-500",
    traits: ["Magical", "Mysterious", "Powerful", "Wise"],
    examples: "Like Fairy Tail, Magi, Re:Zero",
    characters: [
      { id: "mage", name: "Powerful Mage", desc: "Robes, staff, magical aura, glowing eyes" },
      { id: "elf", name: "Forest Elf", desc: "Pointed ears, nature clothes, bow and arrow" },
      { id: "knight", name: "Holy Knight", desc: "Armor, sword, noble bearing, holy symbol" },
      { id: "witch", name: "Mystical Witch", desc: "Hat, cauldron, spell book, mysterious smile" },
    ],
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic, tech-savvy, and edgy! For the digital generation.",
    icon: Zap,
    color: "from-cyan-400 to-blue-600",
    traits: ["Tech-savvy", "Edgy", "Futuristic", "Cool"],
    examples: "Like Akira, Ghost in the Shell, Cyberpunk Edgerunners",
    characters: [
      { id: "hacker", name: "Elite Hacker", desc: "Neon hair, tech gear, glowing implants" },
      { id: "android", name: "Advanced Android", desc: "Metallic parts, LED lights, synthetic skin" },
      { id: "runner", name: "Street Runner", desc: "Leather jacket, cybernetic arms, street style" },
      { id: "netdiver", name: "Net Diver", desc: "VR headset, data streams, digital effects" },
    ],
  },
]

export function AnimeStyleSelector({ userData, setUserData, onNext, onBack }: AnimeStyleSelectorProps) {
  const handleStyleSelect = (styleId: string) => {
    setUserData({ ...userData, animeStyle: styleId, animeCharacter: null })
  }

  const handleCharacterSelect = (characterId: string) => {
    setUserData({ ...userData, animeCharacter: characterId })
  }

  const selectedStyle = animeStyles.find((style) => style.id === userData.animeStyle)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8" />
          Choose Your Anime Style & Character
        </h2>
        <p className="text-muted-foreground text-lg">
          Pick the anime style that matches your personality, then choose your character type! ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animeStyles.map((style, index) => {
          const Icon = style.icon
          const isSelected = userData.animeStyle === style.id

          return (
            <Card
              key={style.id}
              className={`
                relative p-6 cursor-pointer transition-all duration-300 hover:scale-105 animate-float
                ${isSelected ? "ring-2 ring-primary shadow-xl bg-primary/5" : "hover:shadow-lg"}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleStyleSelect(style.id)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-10 rounded-lg`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-glow">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{style.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{style.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">PERSONALITY TRAITS:</p>
                    <div className="flex flex-wrap gap-1">
                      {style.traits.map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">SIMILAR TO:</p>
                    <p className="text-xs text-muted-foreground">{style.examples}</p>
                  </div>
                </div>
              </div>

              {/* Selection Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-primary/5 rounded-lg border-2 border-primary animate-glow" />
              )}
            </Card>
          )
        })}
      </div>

      {selectedStyle && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 animate-glow">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                <selectedStyle.icon className="w-6 h-6" />
                {selectedStyle.name} Style Selected!
              </h3>
              <p className="text-muted-foreground mb-4">{selectedStyle.description}</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {selectedStyle.traits.map((trait) => (
                  <Badge key={trait} className="animate-float">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Character Selection */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Choose Your Character Type
              </h3>
              <p className="text-muted-foreground">
                Select the character archetype that will be used to generate your anime avatar!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedStyle.characters.map((character, index) => {
                const isCharacterSelected = userData.animeCharacter === character.id

                return (
                  <Card
                    key={character.id}
                    className={`
                      p-4 cursor-pointer transition-all duration-300 hover:scale-105 animate-float
                      ${isCharacterSelected ? "ring-2 ring-primary shadow-lg bg-primary/5" : "hover:shadow-md"}
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleCharacterSelect(character.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedStyle.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{character.name}</h4>
                        <p className="text-sm text-muted-foreground">{character.desc}</p>
                      </div>
                      {isCharacterSelected && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-glow">
                          <Sparkles className="w-2 h-2 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg" className="px-8 bg-transparent">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!userData.animeStyle || !userData.animeCharacter}
          size="lg"
          className="px-8 py-3 text-lg font-semibold animate-float"
        >
          Generate Portfolio
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
