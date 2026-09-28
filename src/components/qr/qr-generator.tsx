"use client";

import { useEffect, useState } from "react";

import { DesignPanel } from "@/components/qr/design-panel";
import { DownloadPanel } from "@/components/qr/download-panel";
import { QrContentForm } from "@/components/qr/qr-content-form";
import { QrPreview } from "@/components/qr/qr-preview";
import { QrTypeTabs } from "@/components/qr/qr-type-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { QrType } from "@/lib/qr/types";
import { useQrEditorStore } from "@/stores/qr-editor";

/**
 * Le store est persisté en sessionStorage (utile plus tard pour ne pas perdre le QR en
 * cours après une connexion). On attend la réhydratation avant de monter les formulaires
 * pour que leurs valeurs par défaut (capturées une seule fois par react-hook-form) soient
 * correctes dès le premier rendu.
 */
export function QrGenerator({ defaultType }: { defaultType?: QrType }) {
  const [hydrated, setHydrated] = useState(false);
  const setType = useQrEditorStore((s) => s.setType);

  useEffect(() => {
    Promise.resolve(useQrEditorStore.persist.rehydrate()).then(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated && defaultType) setType(defaultType);
  }, [hydrated, defaultType, setType]);

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  return <QrGeneratorContent />;
}

function QrGeneratorContent() {
  const type = useQrEditorStore((s) => s.type);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <QrTypeTabs />
        <Card>
          <CardContent>
            <QrContentForm type={type} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <DesignPanel />
          </CardContent>
        </Card>
      </div>
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="flex flex-col gap-6">
            <QrPreview />
            <DownloadPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
