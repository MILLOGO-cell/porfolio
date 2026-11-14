import Template from "@/app/Template";

/** Gabarit commun des pages légales : titre, date de mise à jour, sections. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Template>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-20 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-muted [&_a]:text-accent [&_a]:underline">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="!mt-2 text-sm">Dernière mise à jour : {updated}</p>
        {children}
      </article>
    </Template>
  );
}
