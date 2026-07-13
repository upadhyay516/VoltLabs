import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div className={`${elevated ? "glass-elevated" : "glass"} p-5 ${className}`}>
      {children}
    </div>
  );
}
