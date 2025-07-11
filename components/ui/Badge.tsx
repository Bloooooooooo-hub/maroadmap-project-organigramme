import type { ReactNode } from "react"

export const Badge = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </span>
)
