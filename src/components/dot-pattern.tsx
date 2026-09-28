/** Motif de points décoratif (clin d'œil aux QR codes) à placer derrière une section précise. */
export function DotPattern({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-dot-pattern pointer-events-none absolute inset-0 -z-10 opacity-70 ${className}`}
    />
  );
}
