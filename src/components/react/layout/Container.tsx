import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "2% 5%",
        gap: 10,
        boxSizing: "border-box",
        background: "radial-gradient(ellipse at center, #1565a8 0%, #0a1e3d 100%)",
      }}
    >
      {children}
    </div>
  );
}
