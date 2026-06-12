import { JSX, ReactNode } from "react";

interface ContainerProps {
  background: string;
  children: ReactNode;
}

export function Container({ background, children }: ContainerProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 24,
        gap: 18,
        background,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
