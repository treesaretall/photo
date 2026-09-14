import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { getImageUrl } from '../lib/imageUrl'
import { useDeletePhoto } from '../hooks/useDeletePhoto'
import { useReorderPhotos } from '../hooks/useReorderPhotos'
import { useUpdatePhoto } from '../hooks/useUpdatePhoto'
import type { Photo } from '../types/database'

interface AdminPhotoListProps {
  seriesId: string
  photos: Photo[]
}

interface PhotoRowProps {
  photo: Photo
  onSaveCaption: (caption: string | null) => void
  onDelete: () => void
}

function PhotoRow({ photo, onSaveCaption, onDelete }: PhotoRowProps) {
  const [caption, setCaption] = useState(photo.caption ?? '')
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleBlur() {
    const trimmed = caption.trim()
    const nextCaption = trimmed === '' ? null : trimmed
    if (nextCaption !== photo.caption) {
      onSaveCaption(nextCaption)
    }
  }

  function handleDelete() {
    if (window.confirm('Delete this photo? This cannot be undone.')) {
      onDelete()
    }
  }

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-4 border-b border-gray-200 py-3">
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400"
      >
        ⠿
      </button>
      <img src={getImageUrl(photo.thumb_path)} alt="" className="h-16 w-16 object-cover" />
      <input
        type="text"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        onBlur={handleBlur}
        placeholder="Caption"
        aria-label="Caption"
        className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <button type="button" onClick={handleDelete} className="text-sm text-red-600 underline">
        Delete
      </button>
    </li>
  )
}

export default function AdminPhotoList({ seriesId, photos }: AdminPhotoListProps) {
  const updatePhoto = useUpdatePhoto()
  const deletePhoto = useDeletePhoto()
  const reorderPhotos = useReorderPhotos()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = photos.findIndex((photo) => photo.id === active.id)
    const newIndex = photos.findIndex((photo) => photo.id === over.id)
    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const reordered = arrayMove(photos, oldIndex, newIndex)
    reorderPhotos.mutate({ seriesId, photoIds: reordered.map((photo) => photo.id) })
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={photos.map((photo) => photo.id)} strategy={verticalListSortingStrategy}>
        <ul>
          {photos.map((photo) => (
            <PhotoRow
              key={photo.id}
              photo={photo}
              onSaveCaption={(caption) => updatePhoto.mutate({ photoId: photo.id, caption })}
              onDelete={() =>
                deletePhoto.mutate({
                  photoId: photo.id,
                  storagePath: photo.storage_path,
                  thumbPath: photo.thumb_path,
                  mediumPath: photo.medium_path,
                })
              }
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
