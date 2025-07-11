"use client"

type Props = {
  onAdd: () => void
  onReset: () => void
}

export default function FloatingButtons({ onAdd, onReset }: Props) {
  return (
    <div className="fab-stack">
      <button
        className="fab-btn bg-emerald-600 hover:bg-emerald-700"
        title="Ajouter une section"
        onClick={onAdd}
        type="button"
      >
        +
      </button>
      <button
        className="fab-btn bg-orange-500 hover:bg-orange-600"
        title="Réinitialiser"
        onClick={onReset}
        type="button"
      >
        <span className="rotate-[-20deg]">⟳</span>
      </button>
    </div>
  )
}