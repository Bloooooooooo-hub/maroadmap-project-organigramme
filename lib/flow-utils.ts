import type { Node } from "reactflow"

export function createNode(nodes: Node[]): Node {
  const id = `${Date.now()}`
  return {
    id,
    type: "default",
    position: {
      x: 120 + Math.random() * 300,
      y: 120 + Math.random() * 200,
    },
    data: { label: `Section ${nodes.length + 1}` },
  }
}

export function resetFlow() {
  // Juste pour la clarté, la logique est dans le store
  return { nodes: [], edges: [] }
}