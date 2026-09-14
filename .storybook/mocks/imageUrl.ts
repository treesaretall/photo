export function getImageUrl(storagePath: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(storagePath)}/1200/800`
}
