import { create } from 'zustand'

interface UiState {
  lightboxOpenPhotoId: string | null
  openLightbox: (photoId: string) => void
  closeLightbox: () => void
}

export const useUiStore = create<UiState>((set) => ({
  lightboxOpenPhotoId: null,
  openLightbox: (photoId) => set({ lightboxOpenPhotoId: photoId }),
  closeLightbox: () => set({ lightboxOpenPhotoId: null }),
}))
