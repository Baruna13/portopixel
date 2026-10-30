/** Purely decorative corner accents (from the Stitch portrait frame). Hidden from a11y tree. */
export function PixelBorder() {
  return (
    <>
      <span aria-hidden="true" className="absolute -top-3 -left-3 w-4 h-4 bg-secondary border-2 border-on-surface" />
      <span aria-hidden="true" className="absolute -bottom-3 -right-3 w-4 h-4 bg-secondary border-2 border-on-surface" />
    </>
  );
}
