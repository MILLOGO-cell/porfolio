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
import { projets } from "@/data/projets";

interface Projet {
  id: number;
  titre: string;
  image: string;
  description: string;
  status: "En cours" | "Terminé" | "En réflexion";
}

export default function Projets(): JSX.Element {
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenDrawer = (projet: Projet) => {
    setSelectedProjet(projet);
    onOpen();
  };

  //   const breakpointColumnsObj = {
  //     default: 4,
  //     1100: 3,
  //     700: 2,
  //     500: 1,
  //   };

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
            Bienvenu dans l’univers de mes projets.
          </h1>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={{
            default: 4, // 4 colonnes par défaut
            1100: 3, // 3 colonnes pour les écrans moyens
            700: 2, // 2 colonnes pour les petits écrans
            500: 1, // 1 colonne pour les très petits écrans
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
                className="w-full bg-cover bg-center"
                style={{
                  height: "200px",
                  backgroundImage: `url(${projet.image})`,
                }}
                role="img"
                aria-label={`Image de ${projet.titre}`}
              ></div>

              {/* Contenu de la card */}
              <div className="p-4">
                {/* Titre du projet */}
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  {projet.titre}
                </h3>

                {/* Bouton En savoir plus */}
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
          onOpenChange={(open) => !open && setSelectedProjet(null)}
          placement="right"
          size="md"
          backdrop="blur"
          portalContainer={document.body}
          hideCloseButton
        >
          <DrawerContent>
            {selectedProjet && (
              <>
                <DrawerHeader className="flex items-center justify-between  ">
                  <h2 className="text-2xl font-bold">{selectedProjet.titre}</h2>
                  <Button isIconOnly variant="light" onPress={onClose}>
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
                  {/* <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Status :</strong> {selectedProjet.status}
                  </p> */}
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
