"use client";

import { useState } from "react";
import {
  LuArrowRight,
  LuCircleCheck,
  LuLoaderCircle,
  LuSend,
  LuTriangleAlert,
} from "react-icons/lu";
import Template from "../../Template";
import { ScrollReveal } from "@/components/ScrollReveal";
import { buttonClass } from "@/components/ui/button-styles";
import { site, socialLinks } from "@/lib/site";

const fields = [
  { id: "name", label: "Nom", type: "text", placeholder: "Votre nom" },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "vous@exemple.com",
  },
] as const;

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Anti-spam : champ piège (invisible, jamais rempli par un humain) et heure d'ouverture.
  const [openedAt] = useState(() => Date.now());
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website, elapsed: Date.now() - openedAt }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Votre message a bien été envoyé.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setError("Une erreur interne est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/70 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  /**
   * Le bouton reste inactif tant que la saisie ne peut pas aboutir. Les seuils
   * reprennent ceux du serveur (contactSchema) : un bouton actif qui renvoie
   * une erreur de validation fait perdre du temps à l'utilisateur.
   */
  const isFormValid =
    formData.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.message.trim().length >= 10;

  return (
    <Template>
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <ScrollReveal y={24}>
          <header className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Contact
            </p>

            <h1 className="text-pretty text-4xl font-bold tracking-tight md:text-5xl">
              Parlons de votre projet
            </h1>

            <p className="text-pretty leading-relaxed text-muted">
              Décrivez le contexte : objectifs, contraintes, échéance. Je réponds
              sous{" "}
              <span className="font-medium text-foreground">48 heures</span>.
            </p>

            <div className="mt-2 rounded-2xl border border-border bg-surface-muted p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Autres moyens
              </p>
              <div className="mt-4 flex flex-col gap-1">
                {socialLinks.map(({ name, url, icon: Icon }) => (
                  <a
                    key={name}
                    href={url}
                    target={url.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <Icon className="h-4 w-4 text-accent" aria-hidden />
                    {name === "Email" ? site.email : name}
                    <LuArrowRight
                      className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted">
                {site.location}
              </p>
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={0.15} y={24}>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
                >
                  <LuTriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  <LuCircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{success}</span>
                </div>
              )}

              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Ne pas remplir</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {fields.map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className={inputClass}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Le contexte, ce que vous cherchez à faire, vos contraintes…"
                  rows={7}
                  required
                  minLength={10}
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1.5 text-xs text-muted">10 caractères minimum.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={buttonClass("primary", "lg", "w-full")}
              >
                {isSubmitting ? (
                  <>
                    <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <LuSend className="h-4 w-4" aria-hidden />
                    Envoyer
                  </>
                )}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </Template>
  );
}
