"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadQr } from "@/lib/qr/download";
import { buildQrData } from "@/lib/qr/encoders";
import { contentSchemaByType } from "@/lib/qr/schemas";
import { cn } from "@/lib/utils";
import { useQrEditorStore } from "@/stores/qr-editor";

type DownloadFormat = {
  key: string;
  label: string;
  extension: "png" | "svg";
  size: number;
};

const FORMATS: DownloadFormat[] = [
  { key: "png-512", label: "PNG · 512 px", extension: "png", size: 512 },
  { key: "png-1024", label: "PNG · 1024 px", extension: "png", size: 1024 },
  { key: "png-2048", label: "PNG · 2048 px", extension: "png", size: 2048 },
  { key: "svg", label: "SVG (vectoriel)", extension: "svg", size: 1024 },
];

export function DownloadPanel() {
  const type = useQrEditorStore((s) => s.type);
  const content = useQrEditorStore((s) => s.contentByType[s.type]);
  const design = useQrEditorStore((s) => s.design);
  const [format, setFormat] = useState<DownloadFormat>(FORMATS[1]);
  const [pending, setPending] = useState(false);

  const parsed = contentSchemaByType[type].safeParse(content);
  const data = parsed.success ? buildQrData(type, parsed.data) : null;
  const disabled = !data || data.trim().length === 0 || pending;

  async function handleDownload() {
    if (!data) return;
    setPending(true);
    try {
      await downloadQr({ type, data, design, extension: format.extension, size: format.size });
    } catch {
      toast.error("Le téléchargement a échoué. Réessaie.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full overflow-hidden rounded-full shadow-sm shadow-primary/40">
      <Button
        type="button"
        disabled={disabled}
        onClick={handleDownload}
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-12 flex-1 justify-center gap-2 rounded-none border-0 text-sm font-bold tracking-wide uppercase shadow-none hover:translate-y-0 hover:shadow-none",
        )}
      >
        <Download className="size-4" />
        Télécharger <span className="font-medium normal-case opacity-80">· {format.label}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Choisir le format de téléchargement"
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "default" }),
            "border-primary-foreground/25 h-12 w-12 shrink-0 rounded-none border-0 border-l px-0 shadow-none hover:translate-y-0 hover:shadow-none",
          )}
        >
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {FORMATS.map((option) => (
            <DropdownMenuItem key={option.key} onClick={() => setFormat(option)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
