import { ReactNode } from "react"

interface FitProps {
  children: ReactNode
}

export function Fit({ children }: FitProps) {
  return (
    <div style={{ display: "flex", flex: 1 }}>
      {children}
    </div>
  )
}
