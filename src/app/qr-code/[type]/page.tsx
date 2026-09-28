import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DotPattern } from "@/components/dot-pattern";
import { QrGenerator } from "@/components/qr/qr-generator";
import { QR_TYPES, slugToType } from "@/lib/qr/types";

const PAGE_CONTENT: Record<string, { title: string; description: string; intro: string }> = {
  url: {
    title: "Générateur de QR code URL gratuit",
    description:
      "Crée un QR code qui redirige vers un site web ou une page en quelques secondes, gratuitement et sans inscription.",
    intro: "Colle une adresse web : ton QR code s'affiche instantanément, prêt à télécharger.",
  },
  texte: {
    title: "Générateur de QR code texte gratuit",
    description: "Encode n'importe quel texte libre dans un QR code, gratuitement.",
    intro: "Idéal pour partager une citation, une note ou une information courte à scanner.",
  },
  wifi: {
    title: "Générateur de QR code WiFi gratuit",
    description:
      "Crée un QR code qui connecte automatiquement au réseau WiFi, sans avoir à taper le mot de passe.",
    intro: "Renseigne le nom du réseau et le mot de passe : tes invités scannent et se connectent.",
  },
  email: {
    title: "Générateur de QR code Email gratuit",
    description: "Génère un QR code qui ouvre un brouillon d'email pré-rempli.",
    intro: "Ajoute une adresse, un sujet et un message : le QR ouvre directement l'app email.",
  },
  sms: {
    title: "Générateur de QR code SMS gratuit",
    description: "Génère un QR code qui ouvre l'application SMS avec un message pré-rempli.",
    intro: "Renseigne un numéro et un message : le QR pré-remplit l'envoi du SMS.",
  },
  vcard: {
    title: "Générateur de QR code vCard gratuit",
    description: "Crée un QR code carte de visite qui enregistre directement un contact.",
    intro: "Renseigne tes coordonnées : le QR ajoute directement le contact au carnet d'adresses.",
  },
};

export function generateStaticParams() {
  return QR_TYPES.map((entry) => ({ type: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/qr-code/[type]">): Promise<Metadata> {
  const { type: slug } = await params;
  const content = PAGE_CONTENT[slug];
  if (!content) return {};
  return { title: content.title, description: content.description };
}

export default async function QrCodeTypePage({ params }: PageProps<"/qr-code/[type]">) {
  const { type: slug } = await params;
  const type = slugToType(slug);
  const content = PAGE_CONTENT[slug];
  if (!type || !content) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="relative mb-8 space-y-2 py-6 text-center">
        <DotPattern />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.title}</h1>
        <p className="text-muted-foreground mx-auto max-w-xl">{content.intro}</p>
      </div>
      <QrGenerator defaultType={type} />
    </div>
  );
}
