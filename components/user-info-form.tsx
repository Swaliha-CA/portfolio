"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { User, Plus, X, Sparkles, ArrowLeft } from "lucide-react"

interface UserInfoFormProps {
  userData: any
  setUserData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function UserInfoForm({ userData, setUserData, onNext, onBack }: UserInfoFormProps) {
  const [newInterest, setNewInterest] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const addInterest = () => {
    if (newInterest.trim() && !userData.interests.includes(newInterest.trim())) {
      setUserData({
        ...userData,
        interests: [...userData.interests, newInterest.trim()],
      })
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setUserData({
      ...userData,
      interests: userData.interests.filter((i: string) => i !== interest),
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData({
        ...userData,
        skills: [...userData.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter((s: string) => s !== skill),
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value })
  }

  const isFormValid = userData.name && userData.age && userData.school && userData.bio

  const popularInterests = [
    "Anime",
    "Gaming",
    "Music",
    "Art",
    "Sports",
    "Reading",
    "Coding",
    "Dancing",
    "Photography",
    "Cooking",
    "Travel",
    "Movies",
  ]

  const popularSkills = [
    "Programming",
    "Drawing",
    "Writing",
    "Public Speaking",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Creative Thinking",
    "Time Management",
    "Communication",
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <User className="w-8 h-8" />
          Tell Us About Yourself
        </h2>
        <p className="text-muted-foreground text-lg">
          Share your story so we can create the perfect anime character for you! ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4 animate-float">
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Basic Info
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={userData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-sm font-medium">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={userData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="mt-1"
                min="13"
                max="25"
              />
            </div>

            <div>
              <Label htmlFor="school" className="text-sm font-medium">
                School/Institution
              </Label>
              <Input
                id="school"
                placeholder="Your school or college name"
                value={userData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Bio */}
        <Card className="p-6 space-y-4 animate-float" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            About You
          </h3>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your dreams, what makes you unique..."
              value={userData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="mt-1 min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">{userData.bio.length}/500 characters</div>
          </div>
        </Card>
      </div>

      {/* Interests */}
      <Card className="p-6 space-y-4 animate-float" style={{ animationDelay: "0.4s" }}>
        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Your Interests
        </h3>

        <div className="flex gap-2">
          <Input
            placeholder="Add an interest..."
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addInterest()}
            className="flex-1"
          />
          <Button onClick={addInterest} size="sm" disabled={!newInterest.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Popular Interests */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Popular interests:</p>
          <div className="flex flex-wrap gap-2">
            {popularInterests.map((interest) => (
              <Badge
                key={interest}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  if (!userData.interests.includes(interest)) {
                    setUserData({
                      ...userData,
                      interests: [...userData.interests, interest],
                    })
                  }
                }}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selected Interests */}
        {userData.interests.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Your interests:</p>
            <div className="flex flex-wrap gap-2">
              {userData.interests.map((interest: string) => (
                <Badge key={interest} className="animate-glow">
                  {interest}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive"
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Skills */}
      <Card className="p-6 space-y-4 animate-float" style={{ animationDelay: "0.6s" }}>
        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Your Skills
        </h3>

        <div className="flex gap-2">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            className="flex-1"
          />
          <Button onClick={addSkill} size="sm" disabled={!newSkill.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Popular Skills */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
                onClick={() => {
                  if (!userData.skills.includes(skill)) {
                    setUserData({
                      ...userData,
                      skills: [...userData.skills, skill],
                    })
                  }
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selected Skills */}
        {userData.skills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Your skills:</p>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="animate-glow">
                  {skill}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg" className="px-8 bg-transparent">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!isFormValid}
          size="lg"
          className="px-8 py-3 text-lg font-semibold animate-float"
        >
          Choose Anime Style
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
