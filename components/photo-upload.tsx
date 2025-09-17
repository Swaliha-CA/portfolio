"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Upload, Camera, X, Sparkles } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  userData: any
  setUserData: (data: any) => void
  onNext: () => void
}

export function PhotoUpload({ userData, setUserData, onNext }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setUserData({ ...userData, photo: file })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removePhoto = () => {
    setPreview(null)
    setUserData({ ...userData, photo: undefined })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Camera className="w-8 h-8" />
          Upload Your Photo
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose your best photo and we'll transform you into an amazing anime character! 📸
        </p>
      </div>

      <div className="flex justify-center">
        <Card
          className={`
            relative w-80 h-80 border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragging ? "border-primary bg-primary/5 scale-105" : "border-border hover:border-primary/50"}
            ${preview ? "border-solid border-primary" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={triggerFileInput}
        >
          {preview ? (
            <div className="relative w-full h-full group">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 320px) 100vw, 320px"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removePhoto()
                  }}
                  className="animate-float"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-glow">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-float">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Drop your photo here</h3>
              <p className="text-muted-foreground mb-4">or click to browse files</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Supports JPG, PNG, GIF</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

      {preview && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-glow">
            <Sparkles className="w-4 h-4" />
            Perfect! Ready for anime transformation!
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={!preview}
          size="lg"
          className="px-8 py-3 text-lg font-semibold animate-float"
        >
          Continue to Next Step
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
