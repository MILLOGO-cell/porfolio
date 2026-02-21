"use client";

import { useEffect, useState } from "react";
import Template from "../../Template";
import { motion } from "framer-motion";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Contact(): JSX.Element {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Votre message a été envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        setError(
          data.message || "Une erreur s'est produite. Veuillez réessayer."
        );
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setError(
        "Une erreur interne est survenue. Veuillez réessayer plus tard."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };


  return (
    <Template>
      <div className="relative isolate w-full flex flex-col items-center justify-center min-h-screen px-6 py-20 md:py-32 bg-white dark:bg-black text-black dark:text-white">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <ScrollReveal width="100%">
          <div className="text-center mb-8">
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <p className="text-sm md:text-base border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 px-6 py-2 rounded-full font-semibold shadow-sm mb-4">
                UNE IDÉE ?
              </p>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
            >
              Parlons de votre projet
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Envoie-moi un message, je te répondrai sous{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                48 heures maximum
              </span>
              .
            </motion.p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5} width="100%">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900/50 dark:to-indigo-900/20 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-300 dark:border-red-700 flex items-center gap-3"
                  >
                    <span className="text-2xl">⚠</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 p-4 rounded-xl border border-green-300 dark:border-green-700 flex items-center gap-3"
                  >
                    <span className="text-2xl">✓</span>
                    <span>{success}</span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    htmlFor="name"
                    className="block font-semibold mb-2 text-gray-900 dark:text-white"
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label
                    htmlFor="email"
                    className="block font-semibold mb-2 text-gray-900 dark:text-white"
                  >
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@gmail.com"
                    required
                    className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label
                    htmlFor="message"
                    className="block font-semibold mb-2 text-gray-900 dark:text-white"
                  >
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Fais-moi savoir ce que tu as en tête. Parle-moi de ton projet, tes objectifs, ton budget..."
                    rows={6}
                    required
                    className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isSubmitting
                      ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl"
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Discutons ensemble
                        <Image
                          src="/smiley.png"
                          alt="Smiley"
                          width={24}
                          height={24}
                        />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <div className="mt-12 mb-12 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Vous préférez un autre moyen de contact ?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:nicolasmillogo3@gmail.com"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <span>@</span>
                Email
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <span>in</span>
                LinkedIn
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Template>
  );
}