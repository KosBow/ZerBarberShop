import type React from "react"
import { cn } from "@/lib/utils"

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const GoldButton: React.FC<GoldButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-black bg-gradient-to-r from-[#d4af37] to-[#f9dd94] hover:from-[#c9a632] hover:to-[#e4c983] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

