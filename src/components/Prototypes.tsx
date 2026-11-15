"use client";

import Image from "next/image";
import { useState } from "react";
import { LuArrowUpRight, LuPlay, LuX } from "react-icons/lu";
import { buttonClass } from "@/components/ui/button-styles";

type Prototype = {
  title: string;
  description: string;
  image: string;
  url: string;
};

const prototypes: Prototype[] = [
  {
    title: "Data To Decide, site web",
    description:
      "Conception du site de l'organisation : parcours, mise en page et composants, du premier écran aux pages de contenu.",
    image: "/projets/dtod-apercu.webp",
    url: "https://www.figma.com/proto/ejqJirs6eEy7LREPSfWZGl/Data-To-Decide---Refonte-du-site?page-id=0%3A1&node-id=4-18163&t=p8qw6xc4gtDQmKL1-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=4%3A18163&show-proto-sidebar=1",
  },
  {
    title: "LIFE GYM, design web",
    description:
      "Maquette du site d'une salle de sport : offres, planning des cours et inscription.",
    image: "/projets/life-gym-apercu.webp",
    url: "https://www.figma.com/proto/kIqGZwo0F6SSLDeDVY29S8/Projet--Gym?node-id=17-143408&t=fSH0F69nMrVjMfKU-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=17%3A143408&show-proto-sidebar=1&page-id=0%3A1",
  },
  {
    title: "LIFE GYM, application mobile",
    description:
      "Prototype de l'application des adhérents : réservation, suivi et espace personnel.",
    image: "/projets/life-gym-ecrans-1.webp",
    url: "https://www.figma.com/proto/kIqGZwo0F6SSLDeDVY29S8/Projet--Gym?node-id=19-51&t=fSH0F69nMrVjMfKU-0&scaling=min-zoom&content-scaling=fixed&page-id=19%3A2",
  },
];

/** Adresse d'intégration Figma : la version « embed » du même prototype. */
function embedUrl(url: string) {
  const u = new URL(url.replace("://www.figma.com/", "://embed.figma.com/"));
  u.searchParams.set("embed-host", "share");
  return u.toString();
}

/**
 * Le prototype n'est chargé qu'au clic : l'iframe Figma dépose des cookies
 * tiers et pèse lourd, on ne l'impose pas à chaque visite de la page.
 */
export default function Prototypes() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {prototypes.map((p) => {
        const isOpen = open === p.url;

        return (
          <article
            key={p.url}
            className={`glass glass-hover flex flex-col overflow-hidden rounded-3xl ${
              isOpen ? "md:col-span-3" : ""
            }`}
          >
            {isOpen ? (
              <div className="relative aspect-[16/10] w-full bg-surface-muted">
                <iframe
                  src={embedUrl(p.url)}
                  title={`Prototype Figma : ${p.title}`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-[16/10] w-full bg-surface-muted">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col gap-4 p-5">
              <div>
                <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.url)}
                  className={buttonClass("primary", "md")}
                >
                  {isOpen ? (
                    <>
                      <LuX className="h-4 w-4" aria-hidden />
                      Fermer
                    </>
                  ) : (
                    <>
                      <LuPlay className="h-4 w-4" aria-hidden />
                      Essayer le prototype
                    </>
                  )}
                </button>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("secondary", "md")}
                >
                  Ouvrir dans Figma
                  <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
