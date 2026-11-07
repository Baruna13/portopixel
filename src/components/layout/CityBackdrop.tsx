import backdropUrl from "@/assets/world/backdrop.png";

/**
 * A faint, blurred slice of the open-world city behind the console pages, so
 * entering a section still feels like you are standing in the city.
 * To make it stronger/fainter, change the two overlay opacities below
 * (bg-[#071a33]/30 and the gradient).
 */
export function CityBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src={backdropUrl}
        alt=""
        className="h-full w-full scale-105 object-cover blur-[2px] saturate-[0.9] [image-rendering:pixelated]"
      />
      <div className="absolute inset-0 bg-[#071a33]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]/30" />
    </div>
  );
}
