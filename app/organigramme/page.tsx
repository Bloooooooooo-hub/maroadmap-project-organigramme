i"use client"
import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Handle,
  Position,
  getBezierPath,
} from "reactflow"
import "reactflow/dist/style.css"
import type { ReactNode } from "react"
import clsx from "clsx"

// --- Configuration & Constantes ---
const HASURA_ENDPOINT = "https://hasura-preprod.maroadmap.com/v1/graphql"
const HASURA_SECRET = "newpassword"

const USER_PROJECTS = [
  { id: "1", name: "🧪 Mon Projet Vitamine" },
  { id: "2", name: "🚗 Mon Projet Transport" },
  { id: "3", name: "🛒 Mon Projet E-commerce" },
  { id: "4", name: "👤 Mon Projet Personnel" },
]

const STATUS_OPTIONS = [
  { value: "initial", label: "📋 Prévu", class: "status-pending", emoji: "📋", nodeStatus: "initial" },
  { value: "loading", label: "🔄 En cours", class: "status-progress", emoji: "🔄", nodeStatus: "loading" },
  { value: "success", label: "✅ Fait", class: "status-done", emoji: "✅", nodeStatus: "success" },
]

const CONNECTION_TYPES = [
  { value: "default", label: "🌊 Courbe douce", color: "#6B7280" },
  { value: "animated", label: "⚡ Courbe animée", color: "#3B82F6" },
  { value: "dashed", label: "📐 Courbe pointillée", color: "#8B5CF6" },
  { value: "thick", label: "🔗 Courbe épaisse", color: "#10B981" },
]

// --- Composants UI Simples ---
const Button = ({ children, onClick, className = "", variant = "primary", size = "default", disabled = false }) => {
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
      className={`${baseClass} ${variantClass} ${sizeClass} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
  >
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => <div className={`p-4 ${className}`}>{children}</div>

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </span>
)

// --- Icônes SVG ---
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const UndoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
)
const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

// --- Composants de Node ---
export type NodeStatusIndicatorProps = { status?: "loading" | "success" | "error" | "initial"; children: ReactNode }
export const LoadingIndicator = ({ children }: { children: ReactNode }) => (
  <>
    <div className="absolute -left-[1px] -top-[1px] h-[calc(100%+2px)] w-[calc(100%+2px)]">
      <div className="absolute inset-0 overflow-hidden rounded-[7px]">
        <div className="absolute left-1/2 top-1/2 w-[140%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,_rgb(42,67,233)_0deg,_rgba(42,138,246,0)_360deg)] animate-spin" />
      </div>
    </div>
    {children}
  </>
)
const StatusBorder = ({ children, className }: { children: ReactNode; className?: string }) => (
  <>
    <div
      className={clsx(
        "absolute -left-[1px] -top-[1px] h-[calc(100%+2px)] w-[calc(100%+2px)] rounded-[7px] border-2",
        className,
      )}
    />
    {children}
  </>
)
export const NodeStatusIndicator = ({ status, children }: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      return <LoadingIndicator>{children}</LoadingIndicator>
    case "success":
      return <StatusBorder className="border-emerald-600">{children}</StatusBorder>
    case "error":
      return <StatusBorder className="border-red-400">{children}</StatusBorder>
    default:
      return <>{children}</>
  }
}

function CustomNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(data.title || "Nouvelle section")
  const [isCompleted, setIsCompleted] = useState(data.completed || false)
  const [status, setStatus] = useState(data.status || "initial")
  const [annotation, setAnnotation] = useState(data.annotation || "")

  const handleSave = () => {
    data.onUpdate(id, { title, completed: isCompleted, status, annotation })
    setIsEditing(false)
  }

  const handleStatusClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const currentIndex = STATUS_OPTIONS.findIndex((s) => s.value === status)
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length
    const newStatus = STATUS_OPTIONS[nextIndex].value
    setStatus(newStatus)
    data.onUpdate(id, { status: newStatus })
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status)
  return (
    <div className="relative">
      <NodeStatusIndicator status={currentStatus?.nodeStatus}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 min-w-[250px] max-w-[350px] relative">
          <Handle type="target" position={Position.Top} className="w-4 h-4 border-2 border-gray-400 bg-gray-600" />
          <button
            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform z-10 ${status === "initial" ? "bg-amber-500 shadow-amber-500/50" : status === "loading" ? "bg-blue-500 shadow-blue-500/50" : "bg-green-500 shadow-green-500/50"} shadow-lg`}
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
                  className={`flex-1 font-semibold text-gray-800 dark:text-white ${isCompleted ? "line-through opacity-60" : ""} cursor-pointer`}
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

// --- Composants de Edge ---
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {}, data }) => {
  const connectionType = data?.connectionType || "default"
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Bottom,
    targetX,
    targetY,
    targetPosition: Position.Top,
    curvature: 0.25,
  })
  const getEdgeStyle = () => {
    switch (connectionType) {
      case "animated":
        return { stroke: "#3B82F6", strokeWidth: 3, strokeDasharray: "5,5", className: "animate-pulse" }
      case "dashed":
        return { stroke: "#8B5CF6", strokeWidth: 2, strokeDasharray: "10,5" }
      case "thick":
        return { stroke: "#10B981", strokeWidth: 4 }
      default:
        return { stroke: "#374151", strokeWidth: 2 }
    }
  }
  const edgeStyle = getEdgeStyle()
  return (
    <g>
      <path
        id={id}
        style={style}
        className={`react-flow__edge-path ${edgeStyle.className || ""}`}
        d={edgePath}
        stroke={edgeStyle.stroke}
        strokeWidth={edgeStyle.strokeWidth}
        strokeDasharray={edgeStyle.strokeDasharray}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={edgeStyle.stroke} />
        </marker>
      </defs>
    </g>
  )
}

const nodeTypes = { customNode: CustomNode }
const edgeTypes = { custom: CustomEdge }

// --- Composants d'Interface ---
function EmailModal({ isOpen, onClose, onConfirm, darkMode }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e) => {
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

function CustomSidebar({
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
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
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

function FixedNavbar({ setSidebarOpen, projectName }) {
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
          <span className="font-bold text-sm text-blue-600 dark:text-blue-400 truncate max-w-xs">
            {projectName || "MaRoadMap"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Organisez les étapes, structurez vos idées !!
          </span>
        </div>
      </div>
    </nav>
  )
}

function FloatingActionButtons({ addSection, undo }) {
  return (
    <>
      <button
        className="fixed top-1/2 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-30 flex items-center justify-center group -translate-y-10"
        onClick={addSection}
      >
        <PlusIcon />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Nouvelle section
        </div>
      </button>
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

// --- Composant Principal ---
export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedProject, setSelectedProject] = useState("")
  const [projectName, setProjectName] = useState("Nouveau Projet")
  const [projectDescription, setProjectDescription] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [selectedConnectionType, setSelectedConnectionType] = useState("default")
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Helper pour restaurer les fonctions sur les noeuds
  const restoreNodeFunctions = (nodesToRestore) => {
    return nodesToRestore.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onUpdate: (id, newData) => {
          setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n)))
        },
      },
    }))
  }

  // Effet pour charger les données depuis l'URL au démarrage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get("data")

    if (data) {
      try {
        const decodedData = atob(data)
        const parsedData = JSON.parse(decodedData)

        console.log("📊 Données chargées depuis l'URL:", parsedData)

        if (parsedData.projectName) {
          setProjectName(parsedData.projectName)
        }
        if (parsedData.projectDescription) {
          setProjectDescription(parsedData.projectDescription)
        }
        if (parsedData.nodes_data) {
          setNodes(restoreNodeFunctions(parsedData.nodes_data))
        }
        if (parsedData.edges_data) {
          setEdges(parsedData.edges_data)
        }

        alert("✨ Projet généré par l'IA chargé ! Vous pouvez maintenant le modifier et le sauvegarder.")
      } catch (error) {
        console.error("❌ Erreur lors du décodage des données de l'URL:", error)
        alert("❌ Impossible de charger le projet depuis l'URL. Les données sont peut-être corrompues.")
      }
    }
  }, []) // Le tableau vide assure que cet effet ne s'exécute qu'une fois au montage

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const onConnect = useCallback(
    (params) => {
      const newEdge = { ...params, type: "custom", data: { connectionType: selectedConnectionType } }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, selectedConnectionType],
  )

  const addSection = () => {
    const newNode = {
      id: `${Date.now()}`,
      type: "customNode",
      position: { x: Math.random() * 400, y: 320 + Math.random() * 200 },
      data: {
        title: `Section ${nodes.length + 1}`,
        completed: false,
        status: "initial",
        annotation: "",
        onUpdate: (id, newData) => {
          setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n)))
        },
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const saveToDatabase = async (userEmail) => {
    try {
      console.log("🔄 Début de la sauvegarde pour:", userEmail)
      const getUserQuery = `query GetUser($email: String!) { users(where: {email: {_eq: $email}}) { id nom prenom email } }`
      const userResponse = await fetch(HASURA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-hasura-admin-secret": HASURA_SECRET },
        body: JSON.stringify({ query: getUserQuery, variables: { email: userEmail } }),
      })
      const userData = await userResponse.json()
      if (userData.errors) throw new Error(`Erreur GraphQL: ${userData.errors[0].message}`)
      if (!userData.data?.users?.length) {
        alert("❌ Utilisateur non trouvé. Veuillez vous inscrire d'abord.")
        return
      }
      const user = userData.data.users[0]
      console.log("✅ Utilisateur trouvé:", user)

      const totalSteps = nodes.length
      const completedSteps = nodes.filter((node) => node.data.completed).length
      const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

      const finalProjectName =
        projectName ||
        (selectedProject ? USER_PROJECTS.find((p) => p.id === selectedProject)?.name : "Roadmap personnalisée")
      const finalProjectDescription =
        projectDescription || `Roadmap avec ${totalSteps} étapes créée le ${new Date().toLocaleDateString()}`

      const insertRoadmapMutation = `
      mutation InsertRoadmap(
        $user_email: String!, $project_name: String!, $project_description: String,
        $nodes_data: jsonb!, $edges_data: jsonb!, $total_steps: Int!, $completed_steps: Int!,
        $completion_percentage: Int!, $status: String!
      ) {
        insert_roadmaps(
          objects: [{
            user_email: $user_email, project_name: $project_name, project_description: $project_description,
            nodes_data: $nodes_data, edges_data: $edges_data, total_steps: $total_steps,
            completed_steps: $completed_steps, completion_percentage: $completion_percentage, status: $status
          }]
          on_conflict: {
            constraint: roadmaps_user_email_project_name_key
            update_columns: [ project_description, nodes_data, edges_data, total_steps, completed_steps, completion_percentage, status, updated_at ]
          }
        ) { returning { id user_email project_name } }
      }`

      const roadmapResponse = await fetch(HASURA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-hasura-admin-secret": HASURA_SECRET },
        body: JSON.stringify({
          query: insertRoadmapMutation,
          variables: {
            user_email: userEmail,
            project_name: finalProjectName,
            project_description: finalProjectDescription,
            nodes_data: nodes,
            edges_data: edges,
            total_steps: totalSteps,
            completed_steps: completedSteps,
            completion_percentage: completionPercentage,
            status: "active",
          },
        }),
      })
      const roadmapResult = await roadmapResponse.json()
      if (roadmapResult.errors) throw new Error(`Erreur GraphQL: ${roadmapResult.errors[0].message}`)

      alert(`✅ Roadmap "${finalProjectName}" sauvegardée avec succès pour ${user.prenom} ${user.nom}!`)
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error)
      alert(`❌ Erreur lors de la sauvegarde: ${error.message}`)
    }
  }

  const loadFromDatabase = async (userEmail) => {
    try {
      console.log("🔄 Début du chargement pour:", userEmail)
      const getUserRoadmapsQuery = `
      query GetUserRoadmaps($email: String!) {
        roadmaps(where: {user_email: {_eq: $email}}, order_by: {updated_at: desc}) {
          id project_name project_description nodes_data edges_data total_steps completed_steps completion_percentage
        }
        users(where: {email: {_eq: $email}}) { id nom prenom }
      }`
      const response = await fetch(HASURA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-hasura-admin-secret": HASURA_SECRET },
        body: JSON.stringify({ query: getUserRoadmapsQuery, variables: { email: userEmail } }),
      })
      const result = await response.json()
      if (result.errors) throw new Error(`Erreur GraphQL: ${result.errors[0].message}`)
      if (!result.data?.users?.length) {
        alert("❌ Aucun utilisateur trouvé")
        return
      }
      if (!result.data?.roadmaps?.length) {
        alert("📂 Aucune roadmap trouvée")
        return
      }

      const user = result.data.users[0]
      const latestRoadmap = result.data.roadmaps[0]

      setProjectName(latestRoadmap.project_name)
      setProjectDescription(latestRoadmap.project_description)
      setNodes(restoreNodeFunctions(latestRoadmap.nodes_data))
      setEdges(latestRoadmap.edges_data)

      alert(`📂 Roadmap "${latestRoadmap.project_name}" chargée pour ${user.prenom} ${user.nom}!`)
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error)
      alert(`❌ Erreur lors du chargement: ${error.message}`)
    }
  }

  const load = async () => {
    const choice = confirm(
      "Voulez-vous charger depuis la base de données ?\n\nOK = Base de données\nAnnuler = Stockage local",
    )
    if (choice) {
      const email = prompt("Entrez votre adresse email pour charger vos projets :")
      if (email && email.includes("@")) await loadFromDatabase(email)
      else alert("⚠️ Email invalide")
    } else {
      const key = selectedProject ? `flow-${selectedProject}` : "flow-default"
      const saved = localStorage.getItem(key)
      if (saved) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved)
        setNodes(restoreNodeFunctions(savedNodes))
        setEdges(savedEdges)
        alert("📂 Projet chargé depuis le stockage local!")
      }
    }
  }

  const undo = () => {
    if (nodes.length > 0) {
      setNodes(nodes.slice(0, -1))
      alert("↩️ Dernière section supprimée!")
    }
  }

  const getCompletionStats = () => {
    const completed = nodes.filter((n) => n.data.completed).length
    const total = nodes.length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const stats = getCompletionStats()
  const save = () => setShowEmailModal(true)

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      <FixedNavbar setSidebarOpen={setSidebarOpen} projectName={projectName} />
      <CustomSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedConnectionType={selectedConnectionType}
        setSelectedConnectionType={setSelectedConnectionType}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        save={save}
        load={load}
        stats={stats}
      />
      <FloatingActionButtons addSection={addSection} undo={undo} />
      <div className="flex-1 mt-16">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className={darkMode ? "dark" : ""}
        >
          <Background color={darkMode ? "#374151" : "#E5E7EB"} />
          <Controls className={darkMode ? "dark" : ""} />
        </ReactFlow>
      </div>
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onConfirm={saveToDatabase}
        darkMode={darkMode}
      />
    </div>
  )
}
