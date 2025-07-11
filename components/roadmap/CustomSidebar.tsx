"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { XIcon } from "@/components/icons/XIcon"
import { SaveIcon } from "@/components/icons/SaveIcon"
import { FolderIcon } from "@/components/icons/FolderIcon"
import { SunIcon } from "@/components/icons/SunIcon"
import { MoonIcon } from "@/components/icons/MoonIcon"
import { BarChartIcon } from "@/components/icons/BarChartIcon"
import { USER_PROJECTS, CONNECTION_TYPES } from "@/lib/constants"

type Stats = {
  completed: number
  total: number
  percentage: number
}

type CustomSidebarProps = {
  isOpen: boolean
  onClose: () => void
  selectedProject: string
  setSelectedProject: (id: string) => void
  selectedConnectionType: string
  setSelectedConnectionType: (type: string) => void
  darkMode: boolean
  setDarkMode: (isDark: boolean) => void
  save: () => void
  load: () => void
  stats: Stats
}

export function CustomSidebar({
  isOpen,
  onClose,
  selectedProject,
  setSelectedProject,
  selectedConnectionType,
  setSelectedConnectionType,
  darkMode,
  setDarkMode,
  save,
  load,
  stats,
}: CustomSidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">MaRoadMap</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Organigramme</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon />
            </Button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Section Projets */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">📁 Mes Projets</h3>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-all bg-white dark:bg-gray-800 text-black dark:text-white"
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value)
                  if (e.target.value) load()
                }}
              >
                <option value="">Sélectionner un projet</option>
                {USER_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Section Actions */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">💾 Sauvegarde</h3>
              <div className="space-y-2">
                <Button onClick={save} className="w-full justify-start bg-transparent" variant="outline">
                  <div className="flex items-center gap-2">
                    <SaveIcon />
                    <span>Sauvegarder</span>
                  </div>
                </Button>
                <Button onClick={load} className="w-full justify-start bg-transparent" variant="outline">
                  <div className="flex items-center gap-2">
                    <FolderIcon />
                    <span>Charger</span>
                  </div>
                </Button>
              </div>
            </div>
            {/* Section Paramètres */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">⚙️ Paramètres</h3>
              <div className="space-y-3">
                <Button onClick={() => setDarkMode(!darkMode)} className="w-full justify-start" variant="outline">
                  <div className="flex items-center gap-2">
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                    <span>{darkMode ? "Mode Jour" : "Mode Nuit"}</span>
                  </div>
                </Button>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Type de connexion
                  </label>
                  <select
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800 text-black dark:text-white"
                    value={selectedConnectionType}
                    onChange={(e) => setSelectedConnectionType(e.target.value)}
                  >
                    {CONNECTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Footer avec statistiques */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChartIcon />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Progression</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Complété</span>
                    <span>
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <Badge className="text-xs">{stats.percentage}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
