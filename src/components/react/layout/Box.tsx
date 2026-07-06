import React from "react";

interface BoxProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export function Box({ children, style }: BoxProps) {
    return (
        <div    
            style={{
                display: "flex",
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                borderRadius: 16,
                padding: 12,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxSizing: "border-box",
                ...style 
            }}>
            {children}
        </div>
    );
}
