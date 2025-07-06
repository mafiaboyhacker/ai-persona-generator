"use client"

import { HeroSection } from "@/components/sections/hero-section"
import { CodeDemoSection } from "@/components/sections/code-demo-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"
import { PersonaGeneratorSection } from "@/components/sections/persona-generator-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Persona Generator */}
      <PersonaGeneratorSection />
      
      {/* Code Demo Section */}
      <CodeDemoSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CtaSection />
    </div>
  )
}
