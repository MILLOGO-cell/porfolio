/**
 * Classes de bouton partagées. Un helper plutôt qu'un composant : les boutons du
 * site sont tantôt des <button>, tantôt des <Link>, tantôt des <a>.
 *
 * Le dégradé est réservé à la variante `primary` — c'est, avec le titre h1, le
 * seul endroit du site où il apparaît.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:brightness-100";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-purple-500 text-white shadow-raised hover:shadow-float hover:brightness-110",
  // Teinté plutôt que gris : un bouton secondaire reste une action, il doit se
  // distinguer du texte courant.
  secondary:
    "border border-accent/25 bg-accent-soft/60 text-accent hover:border-accent/40 hover:bg-accent-soft",
  ghost: "text-accent hover:bg-accent-soft/60",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm md:min-h-0",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = ""
): string {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}
