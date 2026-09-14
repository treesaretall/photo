import Lightbox from '../components/Lightbox'
import PhotoGrid from '../components/PhotoGrid'
import type { PhotoGroup } from '../components/PhotoGrid'
import { usePhotos } from '../hooks/usePhotos'
import { useSeries } from '../hooks/useSeries'
import { useUiStore } from '../stores/uiStore'

export default function HomePage() {
  const { data: series, isLoading: isSeriesLoading, isError: isSeriesError } = useSeries()
  const { data: photos, isLoading: isPhotosLoading, isError: isPhotosError } = usePhotos()
  const openLightbox = useUiStore((state) => state.openLightbox)

  if (isSeriesLoading || isPhotosLoading) {
    return <p className="px-8 py-8 text-sm text-gray-500">Loading…</p>
  }

  if (isSeriesError || isPhotosError || !series || !photos) {
    return <p className="px-8 py-8 text-sm text-gray-500">Something went wrong loading the photos.</p>
  }

  const groups: PhotoGroup[] = series
    .map((s) => ({
      series: s,
      photos: photos.filter((photo) => photo.series_id === s.id),
    }))
    .filter((group) => group.photos.length > 0)

  return (
    <div>
      <PhotoGrid groups={groups} onPhotoClick={openLightbox} />
      <Lightbox photos={photos} />
    </div>
  )
}
