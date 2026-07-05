import type { CSSProperties, ReactNode } from "react";

interface ColumnProps {
  children: ReactNode;
  flex?: number;
  style?: CSSProperties;
}

export function Column({ children, flex = 1, style }: ColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex,
        gap: 10,
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