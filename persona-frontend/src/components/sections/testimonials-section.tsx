"use client"

import { motion } from "framer-motion"
import { GlassCard } from "../ui/glass-card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Alex Kim",
    role: "AI Influencer Manager",
    company: "StarStream Agency",
    content: "Game-changer for entertainment industry! Created 5 AI influencers in one day with unique personalities and stunning visuals. Our clients love the professional quality.",
    rating: 5,
    avatar: "AK",
    gradient: "from-purple-400 to-pink-400"
  },
  {
    name: "Maya Rodriguez",
    role: "VTuber Producer",
    company: "Virtual Stars Studio",
    content: "Perfect for VTuber character creation! The AI personas have such depth and authenticity. Our talent auditions now include AI-generated backstories.",
    rating: 5,
    avatar: "MR",
    gradient: "from-teal-400 to-blue-400"
  },
  {
    name: "David Park",
    role: "Music Producer",
    company: "NextGen Entertainment",
    content: "Revolutionary for AI singer development. Created complete artist personas with visual identity in minutes. The entertainment industry needs this!",
    rating: 5,
    avatar: "DP",
    gradient: "from-orange-400 to-red-400"
  }
]

const companies = [
  { name: "Persona-LLM", logo: "🧠" },
  { name: "Persona-v.01", logo: "🤖" },
  { name: "GitHub", logo: "🐙" },
  { name: "Anthropic", logo: "🧠" },
  { name: "Hugging Face", logo: "🤗" },
  { name: "Stability AI", logo: "🎨" }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by <span className="neon-text">Entertainment Pros</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join entertainment industry professionals who are revolutionizing content creation 
            with AI influencers, actors, singers, and VTubers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 h-full relative" glow>
                <Quote className="absolute top-4 right-4 w-8 h-8 text-purple-400/30" />
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Logo Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-sm text-gray-400 mb-8">
            Powering the future of entertainment industry
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="text-2xl">{company.logo}</span>
                <span className="font-medium">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <GlassCard className="p-8 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonials[i % 3]?.gradient || 'from-gray-400 to-gray-600'} border-2 border-black flex items-center justify-center text-white text-sm font-semibold`}
                    >
                      {testimonials[i % 3]?.avatar || '?'}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-semibold">5,000+ Entertainment Pros</div>
                  <div className="text-sm text-gray-400">Industry leaders trust us</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
                <span className="text-gray-400">from 1,200+ reviews</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}