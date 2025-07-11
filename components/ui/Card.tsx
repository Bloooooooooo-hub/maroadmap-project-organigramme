import type { ReactNode } from "react"

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
  >
    {children}
  </div>
)

export const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)
