interface RowProps {
  children: React.ReactNode;
}

export function Row({ children }: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 10,
        alignItems: "stretch"
      }}
    >
      {children}
    </div>
  );
}
