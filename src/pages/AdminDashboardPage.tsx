import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPhotoList from '../components/AdminPhotoList'
import CreateSeriesForm from '../components/CreateSeriesForm'
import type { CreateSeriesStatus } from '../components/CreateSeriesForm'
import EditSeriesForm from '../components/EditSeriesForm'
import type { EditSeriesStatus } from '../components/EditSeriesForm'
import UploadForm from '../components/UploadForm'
import type { UploadStatus } from '../components/UploadForm'
import { useCreateSeries } from '../hooks/useCreateSeries'
import { useDeleteSeries } from '../hooks/useDeleteSeries'
import { usePhotos } from '../hooks/usePhotos'
import { useSeries } from '../hooks/useSeries'
import { useUpdateSeries } from '../hooks/useUpdateSeries'
import { useUploadPhoto } from '../hooks/useUploadPhoto'
import { useAuthStore } from '../stores/authStore'
import type { Series } from '../types/database'

function SeriesPhotos({ series }: { series: Series }) {
  const { data: photos } = usePhotos(series.id)
  const updateSeries = useUpdateSeries()
  const deleteSeries = useDeleteSeries()
  const [isEditing, setIsEditing] = useState(false)

  const editStatus: EditSeriesStatus = updateSeries.isPending
    ? 'pending'
    : updateSeries.isError
      ? 'error'
      : 'idle'

  function handleDelete() {
    if (window.confirm(`Delete the "${series.title}" series and all its photos? This cannot be undone.`)) {
      deleteSeries.mutate({ seriesId: series.id, photos: photos ?? [] })
    }
  }

  return (
    <div className="mt-8">
      {isEditing ? (
        <EditSeriesForm
          series={series}
          status={editStatus}
          errorMessage={updateSeries.error instanceof Error ? updateSeries.error.message : null}
          onSubmit={(values) =>
            updateSeries.mutate(
              { seriesId: series.id, ...values },
              { onSuccess: () => setIsEditing(false) },
            )
          }
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{series.title}</h3>
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsEditing(true)} className="text-sm text-gray-600 underline">
              Edit
            </button>
            <button type="button" onClick={handleDelete} className="text-sm text-red-600 underline">
              Delete
            </button>
          </div>
        </div>
      )}
      <AdminPhotoList seriesId={series.id} photos={photos ?? []} />
    </div>
  )
}

export default function AdminDashboardPage() {
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()
  const { data: series } = useSeries()
  const createSeries = useCreateSeries()
  const uploadPhoto = useUploadPhoto()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const createSeriesStatus: CreateSeriesStatus = createSeries.isPending
    ? 'pending'
    : createSeries.isError
      ? 'error'
      : createSeries.isSuccess
        ? 'success'
        : 'idle'

  const uploadStatus: UploadStatus = uploadPhoto.isPending
    ? 'pending'
    : uploadPhoto.isError
      ? 'error'
      : uploadPhoto.isSuccess
        ? 'success'
        : 'idle'

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900">Admin Dashboard</h1>
        <button type="button" onClick={handleSignOut} className="text-sm text-gray-600 underline">
          Sign out
        </button>
      </div>

      <section className="mt-10 max-w-md">
        <h2 className="text-lg font-medium text-gray-900">Create a series</h2>
        <div className="mt-4">
          <CreateSeriesForm
            status={createSeriesStatus}
            errorMessage={createSeries.error instanceof Error ? createSeries.error.message : null}
            onSubmit={(values) => createSeries.mutate(values)}
          />
        </div>
      </section>

      <section className="mt-16 max-w-md">
        <h2 className="text-lg font-medium text-gray-900">Upload a photo</h2>
        <div className="mt-4">
          <UploadForm
            series={series ?? []}
            status={uploadStatus}
            errorMessage={uploadPhoto.error instanceof Error ? uploadPhoto.error.message : null}
            onSubmit={(values) => uploadPhoto.mutate(values)}
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-medium text-gray-900">Photos</h2>
        {series?.map((s) => <SeriesPhotos key={s.id} series={s} />)}
      </section>
    </div>
  )
}
