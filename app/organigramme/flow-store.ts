"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Node, Edge } from "reactflow"

type FlowState = {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      reset: () => set({ nodes: [], edges: [] }),
    }),
    {
      name: "organigramme-flow",
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    }
  )
)