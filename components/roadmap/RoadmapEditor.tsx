"use client"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
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
          <Controls />
        </ReactFlow>
      </div>
      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} onConfirm={handleSave} />
    </div>
  )
}
