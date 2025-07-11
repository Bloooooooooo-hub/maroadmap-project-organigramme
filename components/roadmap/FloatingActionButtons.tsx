"use client"

import { PlusIcon } from "@/components/icons/PlusIcon"
import { UndoIcon } from "@/components/icons/UndoIcon"

type FloatingActionButtonsProps = {
  addSection: () => void
  undo: () => void
}

export function FloatingActionButtons({ addSection, undo }: FloatingActionButtonsProps) {
  return (
    <>
      {/* Bouton Nouvelle Section - Milieu droite, haut */}
      <button
        className="fixed top-1/2 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-30 flex items-center justify-center group -translate-y-10"
        onClick={addSection}
      >
        <PlusIcon />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Nouvelle section
        </div>
      </button>
      {/* Bouton Annuler - Milieu droite, bas */}
      <button
        className="fixed top-1/2 right-6 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-30 flex items-center justify-center group translate-y-10"
        onClick={undo}
      >
        <UndoIcon />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Supprimer dernière
        </div>
      </button>
    </>
  )
}
