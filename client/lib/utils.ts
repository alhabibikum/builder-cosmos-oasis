import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildSrcSet(url: string, widths: number[] = [320, 640, 960, 1200, 1600]) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.includes("pexels.com")) {
      return widths
        .map((w) => {
          const v = new URL(u.toString());
          v.searchParams.set("auto", "compress");
          v.searchParams.set("cs", "tinysrgb");
          v.searchParams.set("w", String(w));
          return `${v.toString()} ${w}w`;
        })
        .join(", ");
    }
    return "";
  } catch {
    return "";
  }
}
