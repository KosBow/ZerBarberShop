import type React from "react"
import Link from "next/link"
import { GoldButton } from "@/components/ui/gold-button"

interface HeroSectionProps {
  title: string
  highlightedTitle: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  highlightedTitle,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
}) => {
  return (
    <section className="relative h-[85vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-2">
            {title}{" "}
            <span className="block mt-2 bg-clip-text text-transparent bg-gold-gradient">{highlightedTitle}</span>
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mb-10">{description}</p>
          <Link href={buttonLink}>
            <GoldButton>{buttonText}</GoldButton>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

