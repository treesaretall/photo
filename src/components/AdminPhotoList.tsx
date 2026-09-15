import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
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
    <li ref={setNodeRef} style={style} className="flex items-center gap-2 py-2 sm:gap-4 sm:py-3">
      <button
        type="button"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab px-1 text-gray-400"
      >
        ⠿
      </button>
      <img
        src={getImageUrl(photo.thumb_path)}
        alt=""
        className="h-12 w-12 shrink-0 rounded object-cover sm:h-16 sm:w-16"
      />
      <input
        type="text"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        onBlur={handleBlur}
        placeholder="Caption"
        aria-label="Caption"
        className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <button type="button" onClick={handleDelete} className="shrink-0 text-sm text-red-600 underline">
        Delete
      </button>
    </li>
  )
}

export default function AdminPhotoList({ seriesId, photos }: AdminPhotoListProps) {
  const updatePhoto = useUpdatePhoto()
  const deletePhoto = useDeletePhoto()
  const reorderPhotos = useReorderPhotos()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move a few pixels before activating, so clicking
      // the handle doesn't feel like it "sticks".
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      // A short press-and-hold before activating so a normal scroll gesture
      // starting on the drag handle isn't hijacked into a drag.
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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

  if (photos.length === 0) {
    return <p className="text-sm text-gray-500">No photos yet — upload one above.</p>
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={photos.map((photo) => photo.id)} strategy={verticalListSortingStrategy}>
        <ul className="divide-y divide-gray-100">
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
