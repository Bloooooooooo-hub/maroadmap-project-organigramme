import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
} from "reactflow"
import "reactflow/dist/style.css"

type Action =
  | { type: "add-node"; node: Node }
  | { type: "add-edge"; edge: Edge }
  | { type: "remove-node"; node: Node }
  | { type: "remove-edge"; edge: Edge }

export default function SimpleFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [actionStack, setActionStack] = useState<Action[]>([])
  const nodeId = useRef(1)

  // Ajouter une section (nœud)
  const addSection = () => {
    const newNode: Node = {
      id: String(nodeId.current++),
      data: { label: `Section ${nodes.length + 1}` },
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
      type: "default",
    }
    setNodes((nds) => [...nds, newNode])
    setActionStack((stack) => [...stack, { type: "add-node", node: newNode }])
  }

  // Annuler la dernière action (ajout de nœud ou d'arête)
  const undo = () => {
    if (actionStack.length === 0) return
    const lastAction = actionStack[actionStack.length - 1]
    setActionStack((stack) => stack.slice(0, -1))
    if (lastAction.type === "add-node") {
      setNodes((nds) => nds.filter((n) => n.id !== lastAction.node.id))
      // Supprimer aussi les arêtes liées à ce nœud
      setEdges((eds) => eds.filter((e) => e.source !== lastAction.node.id && e.target !== lastAction.node.id))
    } else if (lastAction.type === "add-edge") {
      setEdges((eds) => eds.filter((e) => e.id !== lastAction.edge.id))
    }
  }

  // Ajout d'une arête
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge: Edge = { ...params, id: `${params.source}-${params.target}` }
      setEdges((eds) => [...eds, newEdge])
      setActionStack((stack) => [...stack, { type: "add-edge", edge: newEdge }])
    },
    [setEdges, setActionStack],
  )

  return (
    <div className="w-full h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={addSection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ajouter une section
        </button>
        <button
          onClick={undo}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
          disabled={actionStack.length === 0}
        >
          Annuler
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="w-full h-full"
      >
        <Background gap={24} color="#e0e7ef" />
        <MiniMap />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  )
}