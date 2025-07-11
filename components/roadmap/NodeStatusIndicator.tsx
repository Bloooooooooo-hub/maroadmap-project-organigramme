import type { ReactNode } from "react"
import clsx from "clsx"
import type { NodeStatus } from "@/lib/types"

export type NodeStatusIndicatorProps = {
  status?: NodeStatus
  children: ReactNode
}

export const LoadingIndicator = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="absolute -left-[1px] -top-[1px] h-[calc(100%+2px)] w-[calc(100%+2px)]">
        <div className="absolute inset-0 overflow-hidden rounded-[7px]">
          <div className="absolute left-1/2 top-1/2 w-[140%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,_rgb(42,67,233)_0deg,_rgba(42,138,246,0)_360deg)] animate-spin" />
        </div>
      </div>
      {children}
    </>
  )
}

const StatusBorder = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <>
      <div
        className={clsx(
          "absolute -left-[1px] -top-[1px] h-[calc(100%+2px)] w-[calc(100%+2px)] rounded-[7px] border-2",
          className,
        )}
      />
      {children}
    </>
  )
}

export const NodeStatusIndicator = ({ status, children }: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      return <LoadingIndicator>{children}</LoadingIndicator>
    case "success":
      return <StatusBorder className="border-emerald-600">{children}</StatusBorder>
    case "error":
      return <StatusBorder className="border-red-400">{children}</StatusBorder>
    default:
      return <>{children}</>
  }
}
