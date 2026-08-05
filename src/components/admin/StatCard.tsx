import type { IconType } from 'react-icons';

/**
 * Tuile de statistique. Le chiffre porte l'information : pas de pastille
 * colorée ni de dégradé, l'icône reste discrète et l'accent sert au libellé.
 */
export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number | string;
  icon: IconType;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden />
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
