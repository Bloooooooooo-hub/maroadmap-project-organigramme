import dynamic from "next/dynamic"
import Header from "@/components/Header"
import FloatingButtons from "@/components/FloatingButtons"
import { useFlowStore } from "./flow-store"
import { createNode } from "@/lib/flow-utils"

const FlowCanvas = dynamic(() => import("./FlowCanvas"), { ssr: false })

export default function OrganigrammePage() {
  const { nodes, setNodes, reset } = useFlowStore()

  const handleAdd = () => {
    setNodes([...nodes, createNode(nodes)])
  }
  const handleReset = () => {
    reset()
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Header />
      <div className="pt-14 w-full h-[calc(100vh-56px)]">
        <FlowCanvas />
        <FloatingButtons onAdd={handleAdd} onReset={handleReset} />
      </div>
    </div>
  )
}