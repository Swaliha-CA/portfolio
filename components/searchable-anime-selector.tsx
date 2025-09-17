"use client"

import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Sparkles, ArrowLeft, Search, User, Star, Zap } from "lucide-react"

interface SearchableAnimeSelectorProps {
  userData: any
  setUserData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const animeDatabase = [
  {
    id: "attack-on-titan",
    name: "Attack on Titan",
    genre: "Seinen",
    color: "from-red-500 to-orange-600",
    characters: [
      {
        id: "eren-yeager",
        name: "Eren Yeager",
        desc: "Determined protagonist with titan powers, brown hair, intense green eyes",
      },
      {
        id: "levi-ackerman",
        name: "Levi Ackerman",
        desc: "Humanity's strongest soldier, black hair, stoic expression, military uniform",
      },
    ],
  },
  {
    id: "demon-slayer",
    name: "Demon Slayer: Kimetsu no Yaiba",
    genre: "Shonen",
    color: "from-teal-500 to-green-600",
    characters: [
      {
        id: "tanjiro-kamado",
        name: "Tanjiro Kamado",
        desc: "Kind demon slayer with checkered haori, burgundy hair, scar on forehead",
      },
      {
        id: "nezuko-kamado",
        name: "Nezuko Kamado",
        desc: "Demon girl with bamboo muzzle, pink kimono, orange hair with pink tips",
      },
    ],
  },
  {
    id: "death-note",
    name: "Death Note",
    genre: "Seinen",
    color: "from-gray-700 to-black",
    characters: [
      {
        id: "light-yagami",
        name: "Light Yagami",
        desc: "Intelligent student with god complex, brown hair, sharp features, school uniform",
      },
      {
        id: "l-lawliet",
        name: "L Lawliet",
        desc: "Eccentric detective, black messy hair, pale skin, casual clothes, crouched posture",
      },
    ],
  },
  {
    id: "dragon-ball",
    name: "Dragon Ball",
    genre: "Shonen",
    color: "from-orange-500 to-yellow-500",
    characters: [
      { id: "son-goku", name: "Son Goku", desc: "Spiky black hair, orange gi, cheerful expression, muscular build" },
      { id: "vegeta", name: "Vegeta", desc: "Saiyan prince, flame-shaped hair, blue battle suit, proud stance" },
    ],
  },
  {
    id: "fullmetal-alchemist",
    name: "Fullmetal Alchemist",
    genre: "Shonen",
    color: "from-yellow-600 to-red-600",
    characters: [
      {
        id: "edward-elric",
        name: "Edward Elric",
        desc: "Short alchemist with blonde hair, red coat, automail arm, determined expression",
      },
      {
        id: "alphonse-elric",
        name: "Alphonse Elric",
        desc: "Soul in armor, large metal suit, glowing red eyes, gentle personality",
      },
    ],
  },
  {
    id: "jujutsu-kaisen",
    name: "Jujutsu Kaisen",
    genre: "Shonen",
    color: "from-purple-600 to-pink-600",
    characters: [
      {
        id: "yuji-itadori",
        name: "Yuji Itadori",
        desc: "Pink-haired student, school uniform, athletic build, kind smile",
      },
      {
        id: "satoru-gojo",
        name: "Satoru Gojo",
        desc: "White-haired teacher, blindfold/sunglasses, tall, confident smirk",
      },
    ],
  },
  {
    id: "my-hero-academia",
    name: "My Hero Academia",
    genre: "Shonen",
    color: "from-green-500 to-blue-500",
    characters: [
      {
        id: "izuku-midoriya",
        name: "Izuku Midoriya (Deku)",
        desc: "Green-haired hero student, freckles, hero costume, determined expression",
      },
      {
        id: "katsuki-bakugo",
        name: "Katsuki Bakugo",
        desc: "Explosive blonde hero, spiky hair, confident smirk, orange and green costume",
      },
    ],
  },
  {
    id: "naruto",
    name: "Naruto",
    genre: "Shonen",
    color: "from-orange-400 to-blue-500",
    characters: [
      {
        id: "naruto-uzumaki",
        name: "Naruto Uzumaki",
        desc: "Blonde ninja with whisker marks, orange jumpsuit, headband, cheerful grin",
      },
      {
        id: "kakashi-hatake",
        name: "Kakashi Hatake",
        desc: "Silver-haired ninja, mask covering face, one visible eye, relaxed posture",
      },
    ],
  },
  {
    id: "one-piece",
    name: "One Piece",
    genre: "Shonen",
    color: "from-red-500 to-blue-600",
    characters: [
      {
        id: "monkey-d-luffy",
        name: "Monkey D. Luffy",
        desc: "Straw hat pirate, black hair, red vest, wide smile, rubber powers",
      },
      {
        id: "roronoa-zoro",
        name: "Roronoa Zoro",
        desc: "Green-haired swordsman, three swords, muscular build, serious expression",
      },
    ],
  },
  {
    id: "pokemon",
    name: "Pokémon",
    genre: "Adventure",
    color: "from-yellow-400 to-red-500",
    characters: [
      {
        id: "ash-ketchum",
        name: "Ash Ketchum",
        desc: "Pokemon trainer with cap, determined expression, casual clothes, youthful energy",
      },
      {
        id: "pikachu",
        name: "Pikachu",
        desc: "Electric mouse Pokemon, yellow fur, red cheeks, cute expression, lightning bolt tail",
      },
    ],
  },
]

export function SearchableAnimeSelector({ userData, setUserData, onNext, onBack }: SearchableAnimeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAnime, setSelectedAnime] = useState<string | null>(userData.selectedAnime || null)

  const filteredAnime = useMemo(() => {
    if (!searchTerm) return animeDatabase
    return animeDatabase.filter(
      (anime) =>
        anime.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anime.characters.some((char) => char.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        anime.genre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const handleAnimeSelect = (animeId: string) => {
    setSelectedAnime(animeId)
    setUserData({
      ...userData,
      selectedAnime: animeId,
      selectedCharacter: null,
      animeStyle: animeDatabase.find((a) => a.id === animeId)?.genre.toLowerCase() || "shonen",
    })
  }

  const handleCharacterSelect = (characterId: string) => {
    const anime = animeDatabase.find((a) => a.id === selectedAnime)
    const character = anime?.characters.find((c) => c.id === characterId)

    setUserData({
      ...userData,
      selectedCharacter: characterId,
      animeCharacter: characterId,
      characterName: character?.name,
      characterDescription: character?.desc,
    })
  }

  const selectedAnimeData = animeDatabase.find((a) => a.id === selectedAnime)
  const isComplete = selectedAnime && userData.selectedCharacter

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Star className="w-8 h-8" />
          Choose Your Favorite Anime & Character
        </h2>
        <p className="text-muted-foreground text-lg">
          Search and select from popular anime series, then pick your favorite character! ✨
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search anime or character..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-center"
        />
      </div>

      {/* Anime Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnime.map((anime, index) => {
          const isSelected = selectedAnime === anime.id

          return (
            <Card
              key={anime.id}
              className={`
                relative p-4 cursor-pointer transition-all duration-300 hover:scale-105 animate-float
                ${isSelected ? "ring-2 ring-primary shadow-xl bg-primary/5" : "hover:shadow-lg"}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleAnimeSelect(anime.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${anime.color} opacity-10 rounded-lg`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {anime.genre}
                  </Badge>
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-glow">
                      <Sparkles className="w-2 h-2 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-foreground mb-2 text-sm leading-tight">{anime.name}</h3>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">CHARACTERS:</p>
                  <div className="space-y-1">
                    {anime.characters.map((char) => (
                      <div key={char.id} className="text-xs text-muted-foreground">
                        • {char.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute inset-0 bg-primary/5 rounded-lg border-2 border-primary animate-glow" />
              )}
            </Card>
          )
        })}
      </div>

      {/* Character Selection */}
      {selectedAnimeData && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 animate-glow">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6" />
                {selectedAnimeData.name} Selected!
              </h3>
              <Badge className="animate-float">{selectedAnimeData.genre} Genre</Badge>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Choose Your Character
              </h3>
              <p className="text-muted-foreground">Select the character that will inspire your anime avatar!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedAnimeData.characters.map((character, index) => {
                const isCharacterSelected = userData.selectedCharacter === character.id

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
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedAnimeData.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{character.name}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{character.desc}</p>
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
          disabled={!isComplete}
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
