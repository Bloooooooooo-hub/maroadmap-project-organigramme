"use client"

import React, { useCallback } from "react"
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
} from "reactflow"
import "reactflow/dist/style.css"
import { useFlowStore } from "./flow-store"

export default function FlowCanvas() {
  const { nodes, edges, setNodes, setEdges } = useFlowStore()
  const onNodesChange = useCallback(
    (changes) => setNodes(applyNodeChanges(changes, nodes)),
    [setNodes, nodes]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges(applyEdgeChanges(changes, edges)),
    [setEdges, edges]
  )
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(addEdge(params, edges)),
    [setEdges, edges]
  )

  // Helpers React Flow v12
  function applyNodeChanges(changes: any, nodes: Node[]) {
    return changes.reduce((acc: Node[], change: any) => {
      if (change.type === "remove") return acc.filter((n) => n.id !== change.id)
      if (change.type === "add") return [...acc, change.item]
      if (change.type === "reset") return []
      if (change.type === "update") {
        return acc.map((n) => (n.id === change.id ? { ...n, ...change.item } : n))
      }
      return acc
    }, nodes)
  }
  function applyEdgeChanges(changes: any, edges: Edge[]) {
    return changes.reduce((acc: Edge[], change: any) => {
      if (change.type === "remove") return acc.filter((e) => e.id !== change.id)
      if (change.type === "add") return [...acc, change.item]
      if (change.type === "reset") return []
      if (change.type === "update") {
        return acc.map((e) => (e.id === change.id ? { ...e, ...change.item } : e))
      }
      return acc
    }, edges)
  }

  return (
    <div className="w-full h-[calc(100vh-56px)] pt-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-white"
      >
        <Background />
        <Controls position="bottom-left" />
      </ReactFlow>
    </div>
  )
}