import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  prefix: "vkui",
  extend: {
    classGroups: {
      shadow: [
        {
          shadow: ["xshort", "short", "long", "xlong"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
