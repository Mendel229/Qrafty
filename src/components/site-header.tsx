import Link from "next/link";
import { QrCode } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <QrCode className="text-primary h-5 w-5" />
          <span>Qrafty</span>
        </Link>
        <nav className="flex items-center gap-2">
          {/* Connexion et tableau de bord reviennent en Phase 3 (auth Supabase) */}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
