"use client"

import type { ReactNode } from "react"

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "outline" | "ghost"
  size?: "default" | "sm"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "default",
  disabled = false,
  type = "button",
}: ButtonProps) => {
  const baseClass =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      : variant === "ghost"
        ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        : "bg-blue-600 text-white hover:bg-blue-700"
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
