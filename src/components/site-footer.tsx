export function SiteFooter() {
  return (
    <footer className="border-border/40 border-t">
      <div className="text-muted-foreground container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Qrafty. Tous droits réservés.</p>
        {/* Mentions légales et confidentialité reviennent en Phase 7 */}
      </div>
    </footer>
  );
}
