interface ColumnProps {
  children: React.ReactNode;
}

export function Column({ children }: ColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}
