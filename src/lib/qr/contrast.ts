function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** Ratio de contraste WCAG entre deux couleurs hexadécimales (1 à 21). */
export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Vrai si les points du QR sont plus clairs que le fond (beaucoup de lecteurs échouent alors). */
export function isDotsLighterThanBackground(dotsHex: string, backgroundHex: string): boolean {
  return relativeLuminance(dotsHex) > relativeLuminance(backgroundHex);
}

/** Vrai si le contraste points/fond risque de rendre le QR illisible. */
export function hasLowContrast(dotsHex: string, backgroundHex: string): boolean {
  return contrastRatio(dotsHex, backgroundHex) < 3 || isDotsLighterThanBackground(dotsHex, backgroundHex);
}
