"use client";

import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { hasLowContrast } from "@/lib/qr/contrast";
import type { QrDesign } from "@/lib/qr/schemas";
import { useQrEditorStore } from "@/stores/qr-editor";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

const COLOR_PRESETS: { label: string; dots: string; background: string }[] = [
  { label: "Classique", dots: "#000000", background: "#ffffff" },
  { label: "Vert Qrafty", dots: "#146c2e", background: "#ffffff" },
  { label: "Bleu nuit", dots: "#0f172a", background: "#eef2ff" },
  { label: "Bordeaux", dots: "#4c0519", background: "#fff1f2" },
  { label: "Charbon", dots: "#1f2937", background: "#f9fafb" },
];

const DOTS_TYPE_OPTIONS: { value: QrDesign["dotsType"]; label: string; radius: string }[] = [
  { value: "square", label: "Carrés", radius: "rounded-none" },
  { value: "dots", label: "Points", radius: "rounded-full" },
  { value: "rounded", label: "Arrondis", radius: "rounded-[3px]" },
  { value: "extra-rounded", label: "Très arrondis", radius: "rounded-md" },
  { value: "classy", label: "Élégant", radius: "rounded-none rotate-45" },
  { value: "classy-rounded", label: "Élégant arrondi", radius: "rounded-[3px] rotate-45" },
];

const CORNER_SQUARE_OPTIONS: {
  value: QrDesign["cornersSquareType"];
  label: string;
  radius: string;
}[] = [
  { value: "square", label: "Carré", radius: "rounded-none" },
  { value: "dot", label: "Rond", radius: "rounded-full" },
  { value: "extra-rounded", label: "Très arrondi", radius: "rounded-lg" },
];

const CORNER_DOT_OPTIONS: { value: QrDesign["cornersDotType"]; label: string; radius: string }[] =
  [
    { value: "square", label: "Carré", radius: "rounded-none" },
    { value: "dot", label: "Rond", radius: "rounded-full" },
  ];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [text, setText] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Resynchronise le champ texte quand la couleur change depuis l'extérieur
  // (ex: clic sur un thème), sans effet ni rendu superflu (pattern recommandé par React).
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger
            className="border-input size-8 shrink-0 rounded-md border shadow-sm"
            style={{ backgroundColor: value }}
            aria-label={`Choisir la ${label.toLowerCase()}`}
          />
          <PopoverContent className="w-auto p-2.5">
            <HexColorPicker
              color={value}
              onChange={(hex) => {
                setText(hex);
                onChange(hex);
              }}
            />
          </PopoverContent>
        </Popover>
        <input
          value={text}
          onChange={(e) => {
            const next = e.target.value;
            setText(next);
            if (/^#[0-9a-fA-F]{6}$/.test(next)) onChange(next);
          }}
          onBlur={() => setText(value)}
          className="border-input h-8 w-24 rounded-md border bg-transparent px-2 font-mono text-xs"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function ShapeOption({
  selected,
  onClick,
  label,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-pressed={selected}
      aria-label={label}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
        selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function DotsPreview({ radius }: { radius: string }) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className={cn("bg-foreground size-1.5", radius)} />
      ))}
    </div>
  );
}

function CornerPreview({ radius }: { radius: string }) {
  return <div className={cn("border-foreground size-6 border-[3px]", radius)} />;
}

function CornerDotPreview({ radius }: { radius: string }) {
  return <div className={cn("bg-foreground size-3", radius)} />;
}

export function DesignPanel() {
  const design = useQrEditorStore((s) => s.design);
  const setDesign = useQrEditorStore((s) => s.setDesign);
  const resetDesign = useQrEditorStore((s) => s.resetDesign);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lowContrast = hasLowContrast(design.dotsColor, design.backgroundColor);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toast.error("Format non supporté. Utilise un PNG, JPEG ou WebP.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      toast.error("Le logo doit faire 2 Mo maximum.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDesign({ logoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-medium">Personnalisation</h2>
        <Button type="button" variant="ghost" size="sm" onClick={resetDesign}>
          Réinitialiser
        </Button>
      </div>

      <Tabs defaultValue="style">
        <TabsList variant="line">
          <TabsTrigger value="style">Couleur & forme</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-6 pt-4">
          <div className="space-y-1.5">
            <Label>Thèmes</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  title={preset.label}
                  onClick={() =>
                    setDesign({ dotsColor: preset.dots, backgroundColor: preset.background })
                  }
                  className={cn(
                    "flex size-9 items-center justify-center overflow-hidden rounded-full border-2 transition-transform hover:scale-105",
                    design.dotsColor === preset.dots && design.backgroundColor === preset.background
                      ? "border-primary"
                      : "border-border",
                  )}
                  style={{ backgroundColor: preset.background }}
                >
                  <span
                    className="size-3.5 rounded-full"
                    style={{ backgroundColor: preset.dots }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorField
              label="Couleur des points"
              value={design.dotsColor}
              onChange={(hex) => setDesign({ dotsColor: hex })}
            />
            <ColorField
              label="Couleur du fond"
              value={design.backgroundColor}
              onChange={(hex) => setDesign({ backgroundColor: hex })}
            />
          </div>

          {lowContrast && (
            <Alert variant="destructive">
              <AlertTitle>Contraste insuffisant</AlertTitle>
              <AlertDescription>
                Certains lecteurs risquent de ne pas scanner ce QR code. Choisis des points
                nettement plus foncés que le fond.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label>Forme des points</Label>
            <div className="flex flex-wrap gap-2">
              {DOTS_TYPE_OPTIONS.map((option) => (
                <ShapeOption
                  key={option.value}
                  label={option.label}
                  selected={design.dotsType === option.value}
                  onClick={() => setDesign({ dotsType: option.value })}
                >
                  <DotsPreview radius={option.radius} />
                </ShapeOption>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Cadre des coins</Label>
            <div className="flex flex-wrap gap-2">
              {CORNER_SQUARE_OPTIONS.map((option) => (
                <ShapeOption
                  key={option.value}
                  label={option.label}
                  selected={design.cornersSquareType === option.value}
                  onClick={() => setDesign({ cornersSquareType: option.value })}
                >
                  <CornerPreview radius={option.radius} />
                </ShapeOption>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Point central</Label>
            <div className="flex flex-wrap gap-2">
              {CORNER_DOT_OPTIONS.map((option) => (
                <ShapeOption
                  key={option.value}
                  label={option.label}
                  selected={design.cornersDotType === option.value}
                  onClick={() => setDesign({ cornersDotType: option.value })}
                >
                  <CornerDotPreview radius={option.radius} />
                </ShapeOption>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4 pt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleLogoChange}
          />
          <div className="flex items-center gap-3">
            {design.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={design.logoUrl}
                alt="Logo choisi"
                className="border-input size-12 rounded-md border object-contain p-1"
              />
            ) : (
              <div className="border-input text-muted-foreground flex size-12 items-center justify-center rounded-md border border-dashed text-[10px]">
                Aucun
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {design.logoUrl ? "Changer le logo" : "Ajouter un logo"}
                </Button>
                {design.logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDesign({ logoUrl: null })}
                  >
                    Retirer
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground text-xs">PNG, JPEG ou WebP, 2 Mo maximum.</p>
            </div>
          </div>

          {design.logoUrl && (
            <div className="space-y-1.5">
              <Label>Taille du logo ({Math.round(design.logoSize * 100)} %)</Label>
              <Slider
                value={[design.logoSize]}
                min={0.1}
                max={0.4}
                step={0.01}
                onValueChange={(value) =>
                  setDesign({ logoSize: Array.isArray(value) ? value[0] : value })
                }
              />
              <p className="text-muted-foreground text-xs">
                Un logo augmente automatiquement la correction d&apos;erreur du QR code pour
                rester scannable.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
