/**
 * toWebP — derives the .webp path from an image path.
 * /images/photo.jpg → /images/photo.webp
 *
 * Returns null if already .webp or non-image path.
 */
export function toWebP(src: string): string | null {
  if (!src || src.endsWith(".webp")) return null;
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}
