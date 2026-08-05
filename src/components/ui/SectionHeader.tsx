import { ScrollReveal } from "@/components/ScrollReveal";

type SectionHeaderProps = {
  /** Ancre de navigation. */
  id?: string;
  /** Surtitre court en capitales — remplace les anciennes pastilles colorées. */
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <ScrollReveal y={24}>
      <header id={id} className={`flex scroll-mt-28 flex-col gap-3 ${alignment}`}>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </span>

        <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>

        {subtitle && (
          <p className="max-w-2xl text-pretty leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </header>
    </ScrollReveal>
  );
}
