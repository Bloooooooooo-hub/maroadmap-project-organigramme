"use client"

import type React from "react"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { STATUS_OPTIONS } from "@/lib/constants"
import type { CustomNodeData } from "@/lib/types"
import { NodeStatusIndicator } from "./NodeStatusIndicator"
import { Button } from "@/components/ui/Button"

type CustomNodeProps = {
  id: string
  data: CustomNodeData
}

export function CustomNode({ id, data }: CustomNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(data.title || "Nouvelle section")
  const [isCompleted, setIsCompleted] = useState(data.completed || false)
  const [status, setStatus] = useState(data.status || "initial")
  const [annotation, setAnnotation] = useState(data.annotation || "")

  const handleSave = () => {
    data.onUpdate(id, { title, completed: isCompleted, status, annotation })
    setIsEditing(false)
  }

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const currentIndex = STATUS_OPTIONS.findIndex((s) => s.value === status)
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length
    const newStatus = STATUS_OPTIONS[nextIndex].value as "initial" | "loading" | "success"
    setStatus(newStatus)
    data.onUpdate(id, { status: newStatus })
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]

  return (
    <div className="relative">
      <NodeStatusIndicator status={currentStatus?.nodeStatus as any}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 min-w-[250px] max-w-[350px] relative">
          <Handle type="target" position={Position.Top} className="w-4 h-4 border-2 border-gray-400 bg-gray-600" />
          <button
            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform z-10 ${
              status === "initial"
                ? "bg-amber-500 shadow-amber-500/50"
                : status === "loading"
                  ? "bg-blue-500 shadow-blue-500/50"
                  : "bg-green-500 shadow-green-500/50"
            } shadow-lg`}
            onClick={handleStatusClick}
            title={`Cliquer pour changer: ${currentStatus.label}`}
          >
            {currentStatus.emoji}
          </button>
          <div
            className="p-3 border-b border-gray-200 dark:border-gray-600"
            onClick={() => !isEditing && setIsEditing(true)}
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => {
                  setIsCompleted(e.target.checked)
                  data.onUpdate(id, { completed: e.target.checked })
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              {isEditing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-semibold text-gray-800 dark:text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  onBlur={handleSave}
                  autoFocus
                />
              ) : (
                <h3
                  className={`flex-1 font-semibold text-gray-800 dark:text-white ${
                    isCompleted ? "line-through opacity-60" : ""
                  } cursor-pointer`}
                >
                  {title}
                </h3>
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status: {currentStatus.label}</div>
          </div>
          <div className="p-3">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    📝 Annotation:
                  </label>
                  <textarea
                    value={annotation}
                    onChange={(e) => setAnnotation(e.target.value)}
                    className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={2}
                    placeholder="Ajouter une note..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    ❌ Annuler
                  </Button>
                  <Button onClick={handleSave} size="sm">
                    ✅ Sauver
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {annotation && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 italic mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                    📝 {annotation}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">Cliquez pour éditer</div>
              </div>
            )}
          </div>
          <Handle type="source" position={Position.Bottom} className="w-4 h-4 border-2 border-gray-400 bg-gray-600" />
        </div>
      </NodeStatusIndicator>
    </div>
  )
}
