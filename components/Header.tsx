"use client"

export default function Header() {
  return (
    <header className="header">
      {/* Menu burger */}
      <button
        className="mr-4 flex items-center justify-center w-9 h-9 rounded hover:bg-gray-100 active:bg-gray-200"
        aria-label="Menu"
        type="button"
      >
        <svg width={24} height={24} stroke="currentColor" fill="none" strokeWidth={2}>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
      {/* Avatar carré */}
      <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg mr-3">
        M
      </div>
      {/* Titres */}
      <div>
        <div className="text-base font-medium leading-tight">Nouveau Projet</div>
        <div className="text-xs text-gray-500 leading-tight">Organisez les étapes, structurez vos idées !!</div>
      </div>
    </header>
  )
}