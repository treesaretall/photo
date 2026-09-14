import PhotoCard from './PhotoCard'
import { getScatterRows } from '../lib/scatterLayout'
import type { Photo, Series } from '../types/database'

export interface PhotoGroup {
  series: Series
  photos: Photo[]
}

interface PhotoGridProps {
  groups: PhotoGroup[]
  onPhotoClick: (photoId: string) => void
}

interface FlatPhoto {
  photo: Photo
  seriesTitle: string
  seriesLocation: string
  seriesYear: number
}

export default function PhotoGrid({ groups, onPhotoClick }: PhotoGridProps) {
  const flatPhotos: FlatPhoto[] = groups.flatMap(({ series, photos }) =>
    photos.map((photo) => ({
      photo,
      seriesTitle: series.title,
      seriesLocation: series.location,
      seriesYear: series.year,
    })),
  )

  const rows = getScatterRows(flatPhotos.length)

  const rowStarts: number[] = []
  rows.reduce((total, row) => {
    rowStarts.push(total)
    return total + row.length
  }, 0)

  const rowsWithPhotos = rows.map((slots, rowIndex) =>
    slots.map((slot, slotIndex) => ({
      slot,
      item: flatPhotos[rowStarts[rowIndex] + slotIndex],
    })),
  )

  return (
    <div className="relative w-full overflow-x-hidden">
      {rowsWithPhotos.map((row, rowIndex) => (
        <div key={rowIndex} className="flex w-auto">
          {row.map(({ slot, item }) => (
            <div
              key={item.photo.id}
              className="scatter-item"
              style={
                {
                  '--sw': slot.desktop.width,
                  '--smt': slot.desktop.marginTop,
                  '--sml': slot.desktop.marginLeft,
                  '--smb': slot.desktop.marginBottom ?? '0',
                  '--sw-m': slot.mobile.width,
                  '--smt-m': slot.mobile.marginTop,
                  '--sml-m': slot.mobile.marginLeft,
                  '--smb-m': slot.mobile.marginBottom ?? '0',
                } as React.CSSProperties
              }
            >
              <PhotoCard
                photo={item.photo}
                seriesTitle={item.seriesTitle}
                seriesLocation={item.seriesLocation}
                seriesYear={item.seriesYear}
                onClick={() => onPhotoClick(item.photo.id)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
