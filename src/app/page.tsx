import { DotPattern } from "@/components/dot-pattern";
import { QrGenerator } from "@/components/qr/qr-generator";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="relative mb-8 space-y-2 py-6 text-center">
        <DotPattern />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Générateur de QR codes gratuit
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl">
          Crée, personnalise et télécharge ton QR code en quelques secondes, sans inscription.
        </p>
      </div>
      <QrGenerator />
    </div>
  );
}
