"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./Button"

type EmailModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (email: string) => Promise<void>
}

export function EmailModal({ isOpen, onClose, onConfirm }: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      alert("⚠️ Veuillez entrer une adresse email valide")
      return
    }
    setIsLoading(true)
    await onConfirm(email)
    setIsLoading(false)
    setEmail("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💾</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enregistrement de votre travail</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Confirmez votre identité pour sauvegarder</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              📧 Votre adresse email :
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="votre@email.com"
              required
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button onClick={onClose} variant="outline" disabled={isLoading}>
              ❌ Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "⏳ Sauvegarde..." : "✅ Confirmer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
