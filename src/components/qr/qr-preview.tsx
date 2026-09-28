"use client";

import { useEffect, useMemo, useRef } from "react";
import type QRCodeStyling from "qr-code-styling";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { hasLowContrast } from "@/lib/qr/contrast";
import { designToQrOptions } from "@/lib/qr/design";
import { buildQrData } from "@/lib/qr/encoders";
import { contentSchemaByType } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

const PREVIEW_SIZE = 260;

export function QrPreview() {
  const type = useQrEditorStore((s) => s.type);
  const content = useQrEditorStore((s) => s.contentByType[s.type]);
  const design = useQrEditorStore((s) => s.design);

  const debouncedContent = useDebouncedValue(content, 150);
  const debouncedDesign = useDebouncedValue(design, 150);

  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  const qrData = useMemo(() => {
    const parsed = contentSchemaByType[type].safeParse(debouncedContent);
    if (!parsed.success) return null;
    const data = buildQrData(type, parsed.data);
    return data.trim().length > 0 ? data : null;
  }, [type, debouncedContent]);

  useEffect(() => {
    if (!qrData || !containerRef.current) return;

    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;

      const options = designToQrOptions(qrData, debouncedDesign, PREVIEW_SIZE);

      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new QRCodeStyling(options);
        containerRef.current.innerHTML = "";
        qrInstanceRef.current.append(containerRef.current);
      } else {
        qrInstanceRef.current.update(options);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [qrData, debouncedDesign]);

  const lowContrast = hasLowContrast(debouncedDesign.dotsColor, debouncedDesign.backgroundColor);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="border-border flex size-[260px] items-center justify-center rounded-lg border bg-white"
        aria-live="polite"
      >
        <div ref={containerRef} className={qrData ? undefined : "hidden"} />
        {!qrData && (
          <p className="text-muted-foreground px-6 text-center text-sm">
            Remplis le formulaire pour voir ton QR code
          </p>
        )}
      </div>
      {qrData && lowContrast && (
        <Alert variant="destructive" className="w-full">
          <AlertTitle>Contraste insuffisant</AlertTitle>
          <AlertDescription>Ce QR code risque d&apos;être difficile à scanner.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
