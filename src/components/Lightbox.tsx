import { useEffect } from 'react'
import { getImageUrl } from '../lib/imageUrl'
import { useUiStore } from '../stores/uiStore'
import type { Photo } from '../types/database'

interface LightboxProps {
  photos: Photo[]
}

export default function Lightbox({ photos }: LightboxProps) {
  const lightboxOpenPhotoId = useUiStore((state) => state.lightboxOpenPhotoId)
  const openLightbox = useUiStore((state) => state.openLightbox)
  const closeLightbox = useUiStore((state) => state.closeLightbox)

  const currentPhoto = photos.find((photo) => photo.id === lightboxOpenPhotoId) ?? null

  useEffect(() => {
    if (!currentPhoto) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPhoto, closeLightbox])

  if (!currentPhoto) {
    return null
  }

  const seriesPhotos = photos.filter((photo) => photo.series_id === currentPhoto.series_id)
  const currentIndex = seriesPhotos.findIndex((photo) => photo.id === currentPhoto.id)
  const previousPhoto = seriesPhotos[(currentIndex - 1 + seriesPhotos.length) % seriesPhotos.length]
  const nextPhoto = seriesPhotos[(currentIndex + 1) % seriesPhotos.length]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={closeLightbox}
    >
      <img
        src={getImageUrl(currentPhoto.storage_path)}
        alt={currentPhoto.caption ?? ''}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        aria-label="Close"
        onClick={(event) => {
          event.stopPropagation()
          closeLightbox()
        }}
        className="absolute right-6 top-6 text-3xl text-white"
      >
        &times;
      </button>
      {seriesPhotos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation()
              openLightbox(previousPhoto.id)
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-white"
          >
            &lsaquo;
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation()
              openLightbox(nextPhoto.id)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white"
          >
            &rsaquo;
          </button>
        </>
      )}
    </div>
  )
}
