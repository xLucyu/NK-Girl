import { JSX } from "react";

interface GameHeaderProps {
  mode: string;
  name?: string;
  variant?: string;
  badge?: string;
}

export function Header({
  mode,
  name,
  variant,
  badge,
}: GameHeaderProps): JSX.Element {

  const title = [mode, name, variant].filter(Boolean).join(" - ");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        minHeight: 88,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 420,
          maxWidth: "70%",
          padding: "16px 32px",
          borderRadius: 24,
          background: "linear-gradient(180deg, #bfc9d4 0%, #9eabb8 100%)",
          border: "3px solid #7e8a97",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.28), 0 8px 18px rgba(0,0,0,0.18)",
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 900,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          WebkitTextStroke: "2px #111111",
          boxSizing: "border-box",
        }}
      >
        {title}
      </div>

      {badge && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 0,
            top: 6,
            minWidth: 150,
            padding: "12px 24px",
            borderRadius: 20,
            background: "linear-gradient(180deg, #ff7b1f 0%, #e54d00 100%)",
            border: "3px solid rgba(255,255,255,0.4)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), 0 6px 14px rgba(0,0,0,0.18)",
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 900,
            textTransform: "uppercase",
            WebkitTextStroke: "1.5px #111111",
            boxSizing: "border-box",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
}
