import type { DrawType, Options } from "qr-code-styling";

import type { QrDesign } from "./schemas";

/** Convertit le design (couleurs, formes, logo) en options pour qr-code-styling. */
export function designToQrOptions(
  data: string,
  design: QrDesign,
  size: number,
  type: DrawType = "canvas",
): Options {
  return {
    type,
    width: size,
    height: size,
    data,
    margin: design.margin,
    qrOptions: {
      errorCorrectionLevel: design.logoUrl ? "H" : "M",
    },
    dotsOptions: {
      type: design.dotsType,
      color: design.dotsColor,
    },
    backgroundOptions: {
      color: design.backgroundColor,
    },
    cornersSquareOptions: {
      type: design.cornersSquareType,
    },
    cornersDotOptions: {
      type: design.cornersDotType,
    },
    image: design.logoUrl ?? undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 4,
      imageSize: design.logoSize,
      hideBackgroundDots: true,
    },
  };
}
