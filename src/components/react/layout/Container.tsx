interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        padding: "2% 5%",
        gap: 10,
        background: "radial-gradient(ellipse at center, #1565a8 0%, #0a1e3d 100%)",
      }}
    >
      {children}
    </div>
  );
}