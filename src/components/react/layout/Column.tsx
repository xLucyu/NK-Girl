import type { CSSProperties, ReactNode } from "react";

interface ColumnProps {
  children: ReactNode;
  flex?: number;
  gap?: number;
  style?: CSSProperties;
}

export function Column({ children, flex = 1, gap = 10, style }: ColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex,
        gap,
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
