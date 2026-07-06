import type { CSSProperties, ReactNode } from "react";

interface RowProps {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}

export function Row({ children, gap = 10, style }: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap,
        alignItems: "stretch",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
