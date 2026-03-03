/**
 * toWebP — derives the .webp path from an image path.
 * /images/photo.jpg → /images/webp/photo.webp
 *
 * Returns null if already .webp or non-image path.
 */
export function toWebP(src: string): string | null {
  if (!src || src.endsWith(".webp")) return null;
  return src.replace(/^\/images\/(.+)\.(jpe?g|png)$/i, "/images/webp/$1.webp");
}
