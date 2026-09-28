import type { FileExtension } from "qr-code-styling";

import { designToQrOptions } from "./design";
import type { QrDesign } from "./schemas";
import type { QrType } from "./types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Génère un QR hors écran à la taille demandée et déclenche son téléchargement. */
export async function downloadQr(params: {
  type: QrType;
  data: string;
  design: QrDesign;
  extension: Extract<FileExtension, "png" | "svg">;
  size: number;
  filename?: string;
}) {
  const { default: QRCodeStyling } = await import("qr-code-styling");
  const drawType = params.extension === "svg" ? "svg" : "canvas";
  const options = designToQrOptions(params.data, params.design, params.size, drawType);
  const instance = new QRCodeStyling(options);
  const name = params.filename ?? `qr-${params.type}-${today()}`;
  await instance.download({ name, extension: params.extension });
}
