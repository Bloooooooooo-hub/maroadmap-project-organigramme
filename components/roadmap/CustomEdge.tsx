import { getBezierPath, Position, type EdgeProps } from "reactflow"

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style = {}, data }: EdgeProps) {
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
