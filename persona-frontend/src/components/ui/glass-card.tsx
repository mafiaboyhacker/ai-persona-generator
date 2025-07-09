"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg"
  glow?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, blur = "lg", glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card rounded-lg",
          glow && "neon-glow",
          className
        )}
        style={{
          backdropFilter: `var(--blur-${blur}) saturate(180%)`,
        }}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }