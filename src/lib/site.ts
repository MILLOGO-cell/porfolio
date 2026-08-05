import type { IconType } from "react-icons";
import {
  LuBriefcase,
  LuGithub,
  LuLayers,
  LuLinkedin,
  LuMail,
  LuWrench,
} from "react-icons/lu";

/**
 * Identité et navigation — source unique.
 *
 * Positionnement : ingénieur logiciel, pas prestataire web. Le portfolio met en
 * avant ce qui a été construit, pas un catalogue de prestations.
 */
export const site = {
  name: "Nicolas MILLOGO",
  shortName: "NM",
  role: "Ingénieur logiciel",
  tagline:
    "Je conçois et développe des applications métiers : systèmes bancaires, contrôle interne, conformité et détection de fraude.",
  email: "nicolasmillogo3@gmail.com",
  location: "Ouagadougou, Burkina Faso",
  employer: {
    name: "LICELI Technologies",
    url: "https://liceli-technologies.com",
  },
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: IconType;
};

export const navItems: NavItem[] = [
  { href: "/projets", label: "Projets", icon: LuBriefcase },
  { href: "/#expertise", label: "Expertise", icon: LuLayers },
  { href: "/#stack", label: "Stack", icon: LuWrench },
];

export type SocialLink = {
  name: string;
  url: string;
  icon: IconType;
};

export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", url: "https://linkedin.com", icon: LuLinkedin },
  { name: "GitHub", url: "https://github.com", icon: LuGithub },
  { name: "Email", url: `mailto:${site.email}`, icon: LuMail },
];
