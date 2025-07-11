"use client"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
} from "reactflow"
import "reactflow/dist/style.css"

import { CustomNode } from "./CustomNode"
import { CustomEdge } from "./CustomEdge"
import { FixedNavbar } from "./FixedNavbar"
import { CustomSidebar } from "./CustomSidebar"
import { FloatingActionButtons } from "./FloatingActionButtons"
import { EmailModal } from "@/components/ui/EmailModal"

import { saveToDatabase, loadFromDatabase } from "@/lib/hasura"
import type { RoadmapNode, CustomNodeData } from "@/lib/types"

const nodeTypes = { customNode: CustomNode }
const edgeTypes = { custom: CustomEdge }

export default function RoadmapEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedProject, setSelectedProject] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [selectedConnectionType, setSelectedConnectionType] = useState("default")
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = {
        ...params,
        type: "custom",
        data: { connectionType: selectedConnectionType },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, selectedConnectionType],
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const onUpdateNode = (id: string, newData: Partial<CustomNodeData>) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n)))
  }

  const addSection = () => {
    const newNode: RoadmapNode = {
      id: `${Date.now()}`,
      type: "customNode",
      position: { x: Math.random() * 400, y: 320 + Math.random() * 200 },
      data: {
        title: `Section ${nodes.length + 1}`,
        completed: false,
        status: "initial",
        annotation: "",
        onUpdate: onUpdateNode,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const handleSave = async (userEmail: string) => {
    await saveToDatabase(userEmail, nodes, edges, selectedProject)
  }

  const load = async () => {
    const choice = confirm(
      "Voulez-vous charger depuis la base de données ?\n\nOK = Base de données\nAnnuler = Stockage local",
    )
    if (choice) {
      const email = prompt("Entrez votre adresse email pour charger vos projets :")
      if (email && email.includes("@")) {
        const roadmapData = await loadFromDatabase(email)
        if (roadmapData) {
          const restoredNodes = roadmapData.nodes_data.map((node: any) => ({
            ...node,
            data: {
              ...node.data,
              onUpdate: onUpdateNode,
            },
          }))
          setNodes(restoredNodes)
          setEdges(roadmapData.edges_data)
        }
      } else {
        alert("⚠️ Email invalide")
      }
    } else {
      const key = selectedProject ? `flow-${selectedProject}` : "flow-default"
      const saved = localStorage.getItem(key)
      if (saved) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved)
        const restoredNodes = savedNodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: onUpdateNode,
          },
        }))
        setNodes(restoredNodes)
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

  // --- UI ENHANCEMENTS ---

  // Couleurs pour la mini-map
  const nodeColor = (node: any) => {
    if (node.data.status === "success") return "#10B981"
    if (node.data.status === "loading") return "#3B82F6"
    return "#F59E42"
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      <FixedNavbar setSidebarOpen={setSidebarOpen} />
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
      <div className="flex-1 mt-16 relative">
        <div className="absolute inset-0 p-4">
          <div className="h-full w-full rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                <div className="text-5xl mb-4">🗺️</div>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Commencez votre roadmap !</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Cliquez sur <span className="font-semibold text-blue-600">"Nouvelle section"</span> pour ajouter une étape.
                </p>
              </div>
            )}
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
              <Background
                variant="lines"
                gap={32}
                color={darkMode ? "#374151" : "#c7d2fe"}
                lineWidth={1.5}
              />
              <MiniMap
                nodeColor={nodeColor}
                nodeStrokeWidth={3}
                maskColor={darkMode ? "rgba(30,41,59,0.7)" : "rgba(59,130,246,0.08)"}
                className="rounded-lg shadow-lg border border-blue-200 dark:border-gray-700"
                pannable
                zoomable
              />
              <Controls
                showInteractive={false}
                position="top-right"
                className="!top-6 !right-6 scale-125"
                style={{ background: "rgba(255,255,255,0.85)", borderRadius: "0.75rem", boxShadow: "0 2px 8px #0001" }}
              />
            </ReactFlow>
          </div>
        </div>
      </div>
      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} onConfirm={handleSave} />
    </div>
  )
}