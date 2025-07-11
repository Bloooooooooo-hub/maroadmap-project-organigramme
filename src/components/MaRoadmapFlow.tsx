import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
} from "reactflow"
import "reactflow/dist/style.css"

// --- UI Components ---
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
      type="button"
    >
      {children}
    </button>
  )
}

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const UndoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

// --- Custom Node ---
function CustomNode({ id, data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-600 min-w-[180px] max-w-[300px] p-3">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-gray-400 bg-gray-600" />
      <div className="font-semibold text-gray-800 dark:text-white mb-2">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-gray-400 bg-gray-600" />
    </div>
  )
}
const nodeTypes = { customNode: CustomNode }

// --- Main Component ---
export default function MaRoadmapFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Ajout d'une section
  const addSection = () => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: "customNode",
      position: { x: 120 + Math.random() * 300, y: 120 + Math.random() * 200 },
      data: { label: `Section ${nodes.length + 1}` },
    }
    setNodes((nds) => [...nds, newNode])
  }

  // Annuler la dernière section
  const undo = () => {
    if (nodes.length > 0) setNodes((nds) => nds.slice(0, -1))
  }

  // Ajout d'une arête
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      {/* Navbar sticky */}
      <nav className="sticky-navbar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">MaRoadMap</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? "☀️ Mode Jour" : "🌙 Mode Nuit"}
          </Button>
        </div>
      </nav>
      {/* Carte centrale */}
      <main className="main-card flex flex-col items-center justify-center w-full mt-8 mb-8">
        <div className="w-full h-[600px] max-w-5xl relative">
          {/* Boutons flottants */}
          <button
            className="fab fab-add group"
            onClick={addSection}
            title="Nouvelle section"
          >
            <PlusIcon />
            <span className="fab-label">Nouvelle section</span>
          </button>
          <button
            className="fab fab-undo group"
            onClick={undo}
            title="Annuler"
            disabled={nodes.length === 0}
          >
            <UndoIcon />
            <span className="fab-label">Annuler</span>
          </button>
          {/* React Flow */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className={`w-full h-full rounded-2xl border border-blue-100 dark:border-gray-700 shadow-lg ${darkMode ? "dark" : ""}`}
          >
            <Background color={darkMode ? "#374151" : "#E5E7EB"} />
            <Controls className={darkMode ? "dark" : ""} />
          </ReactFlow>
        </div>
      </main>
    </div>
  )
}