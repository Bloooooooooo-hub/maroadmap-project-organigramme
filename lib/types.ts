import type { Node, Edge } from "reactflow"

export interface CustomNodeData {
  title: string
  completed: boolean
  status: "initial" | "loading" | "success"
  annotation: string
  onUpdate: (id: string, newData: Partial<CustomNodeData>) => void
}

export type RoadmapNode = Node<CustomNodeData>
export type RoadmapEdge = Edge

export type NodeStatus = "loading" | "success" | "error" | "initial"
