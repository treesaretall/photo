import { getImageUrl } from '../lib/imageUrl'
import type { Photo } from '../types/database'

interface PhotoCardProps {
  photo: Photo
  seriesTitle: string
  seriesLocation: string
  seriesYear: number
  onClick: () => void
}

export default function PhotoCard({ photo, seriesTitle, seriesLocation, seriesYear, onClick }: PhotoCardProps) {
  return (
    <button type="button" onClick={onClick} className="group block w-full text-left">
      <img
        src={getImageUrl(photo.medium_path)}
        alt={photo.caption ?? seriesTitle}
        className="w-full object-cover"
      />
      <p className="mt-1 text-sm text-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {seriesTitle} — {seriesLocation}, {seriesYear}
      </p>
    </button>
  )
}
