"use client";

import { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import Template from "../../Template";
import { FaArrowRight } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
  Chip,
} from "@nextui-org/react";

interface Projet {
  id: number;
  titre: string;
  image: string;
  description: string;
  status: "En cours" | "Terminé" | "En réflexion";
}

const projets: Projet[] = [
  {
    id: 1,
    titre: "Medysis",
    image: "/medysis.png",
    description:
      "Medysis est un système de gestion de centre de santé complet. Il inclut la gestion des patients, des rendez-vous, des consultations, ainsi qu'un module dédié à la pharmacie.",
    status: "En cours",
  },
  {
    id: 2,
    titre: "Agropole",
    image: "/agropole.png",
    description:
      "Une plateforme connectée pour les agriculteurs, intégrant une marketplace, des prévisions météorologiques et des outils de gestion agricole.",
    status: "Terminé",
  },
  {
    id: 3,
    titre: "Exclusivity",
    image: "/exclusivity.png",
    description:
      "Un réseau social innovant qui met en avant des interactions exclusives entre les utilisateurs, avec gestion des followers et des publications.",
    status: "En cours",
  },
  {
    id: 4,
    titre: "ITouch",
    image: "/itouch.png",
    description:
      "Une application complète pour la gestion des bars et restaurants, intégrant la gestion des employés, des salaires, et la génération automatisée des fiches de paie.",
    status: "Terminé",
  },
];

export default function Projets(): JSX.Element {
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenDrawer = (projet: Projet) => {
    setSelectedProjet(projet);
    onOpen();
  };

  const handleCloseDrawer = () => {
    setSelectedProjet(null);
    onClose();
  };

  const getStatusColor = (status: Projet["status"]): string => {
    switch (status) {
      case "En cours":
        return "bg-orange-500 text-white";
      case "Terminé":
        return "bg-green-500 text-white";
      case "En réflexion":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <Template>
      <div className="relative isolate px-4 sm:px-6 md:px-10 lg:px-16 pt-8 sm:pt-10 md:pt-14 bg-white dark:bg-black text-black dark:text-white">
        {/* Background Elements */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        {/* Titre */}
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold">
            Bienvenue dans l’univers de mes projets.
          </h1>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={{
            default: 4,
            1100: 3,
            700: 2,
            500: 1,
          }}
          className="flex w-auto gap-4 px-6"
          columnClassName="bg-clip-padding"
        >
          {projets.map((projet) => (
            <div
              key={projet.id}
              className="mb-4 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
            >
              {/* Image de la card */}
              <div
                className="w-full bg-cover bg-center group"
                style={{
                  height: "200px",
                  backgroundImage: `url(${projet.image})`,
                }}
                role="img"
                aria-label={`Image de ${projet.titre}`}
              >
                <div className="w-full h-full bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>

              {/* Contenu de la card */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  {projet.titre}
                </h3>

                <button
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white rounded-full shadow-md hover:scale-105 transition transform"
                  onClick={() => handleOpenDrawer(projet)}
                >
                  En savoir plus
                  <FaArrowRight className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </Masonry>

        {/* Drawer */}
        <Drawer
          isOpen={isOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDrawer();
          }}
          placement="right"
          size="md"
          backdrop="blur"
          portalContainer={document.body}
          hideCloseButton
        >
          <DrawerContent>
            {selectedProjet && (
              <>
                <DrawerHeader className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedProjet.titre}</h2>
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={handleCloseDrawer}
                  >
                    &times;
                  </Button>
                </DrawerHeader>
                <DrawerBody>
                  <Image
                    src={selectedProjet.image}
                    alt={selectedProjet.titre}
                    width={400}
                    height={250}
                    className="rounded-lg mb-4"
                  />
                  <Chip
                    className={`mb-4 ${getStatusColor(selectedProjet.status)}`}
                    variant="flat"
                    size="sm"
                  >
                    {selectedProjet.status}
                  </Chip>
                  <p>{selectedProjet.description}</p>
                </DrawerBody>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </Template>
  );
}
