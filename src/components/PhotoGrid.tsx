import PhotoCard from './PhotoCard'
import type { Photo, Series } from '../types/database'

export interface PhotoGroup {
  series: Series
  photos: Photo[]
}

interface PhotoGridProps {
  groups: PhotoGroup[]
  onPhotoClick: (photoId: string) => void
}

export default function PhotoGrid({ groups, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="flex flex-col gap-16 px-8 py-8">
      {groups.map(({ series, photos }) => (
        <section key={series.id}>
          <h2 className="mb-6 text-lg font-medium text-gray-900">{series.title}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                seriesTitle={series.title}
                seriesLocation={series.location}
                seriesYear={series.year}
                onClick={() => onPhotoClick(photo.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
