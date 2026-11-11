import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the custom font sizes from tailwind.config.ts.
 * Without this it treats `text-label-sm` (a font SIZE) as a text COLOUR and
 * silently deletes the real colour (e.g. `text-primary`) from the same element,
 * which made buttons look dark-on-dark.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["headline-xl", "headline-xl-mobile", "headline-lg", "headline-md", "body-lg", "body-md", "label-sm"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}