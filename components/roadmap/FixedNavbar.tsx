"use client"

import { Button } from "@/components/ui/Button"
import { MenuIcon } from "@/components/icons/MenuIcon"

type FixedNavbarProps = {
  setSidebarOpen: (isOpen: boolean) => void
}

export function FixedNavbar({ setSidebarOpen }: FixedNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-40 flex items-center px-4 shadow-sm">
      <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
        <MenuIcon />
      </Button>
      <div className="flex items-center gap-2 ml-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">M</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-blue-600 dark:text-blue-400">MaRoadMap</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Organisez les étapes, structurez vos idées !!
          </span>
        </div>
      </div>
    </nav>
  )
}
