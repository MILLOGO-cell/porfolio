import type { IconType } from "react-icons";

/**
 * Pastille d'état. Chaque teinte porte un sens précis :
 * la couleur informe, elle ne décore pas.
 */
export type BadgeTone = "accent" | "success" | "warning" | "info" | "neutral";

const tones: Record<BadgeTone, string> = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  neutral: "border border-border text-muted",
};

export default function Badge({
  tone = "neutral",
  icon: Icon,
  children,
}: {
  tone?: BadgeTone;
  icon?: IconType;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden />}
      {children}
    </span>
  );
}

/** Puce de technologie, teintée pour se distinguer du texte courant. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
      {children}
    </span>
  );
}
