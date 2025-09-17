import { AnimePortfolioMaker } from "@/components/anime-portfolio-maker"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      <AnimatedBackground />
      <AnimePortfolioMaker />
    </main>
  )
}
