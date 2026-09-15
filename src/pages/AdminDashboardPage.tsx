import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPhotoList from '../components/AdminPhotoList'
import CreateSeriesForm from '../components/CreateSeriesForm'
import type { CreateSeriesStatus } from '../components/CreateSeriesForm'
import EditSeriesForm from '../components/EditSeriesForm'
import type { EditSeriesStatus } from '../components/EditSeriesForm'
import ProfilePictureForm from '../components/ProfilePictureForm'
import type { ProfilePictureStatus } from '../components/ProfilePictureForm'
import UploadForm from '../components/UploadForm'
import type { UploadStatus } from '../components/UploadForm'
import { useCreateSeries } from '../hooks/useCreateSeries'
import { useDeleteSeries } from '../hooks/useDeleteSeries'
import { usePhotos } from '../hooks/usePhotos'
import { useProfile } from '../hooks/useProfile'
import { useSeries } from '../hooks/useSeries'
import { useUpdateProfilePicture } from '../hooks/useUpdateProfilePicture'
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
    <div className="rounded-lg border border-gray-200 p-4 sm:p-6">
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{series.title}</h3>
            <p className="text-xs text-gray-500">
              {series.location}, {series.year} · {(photos ?? []).length} photo
              {(photos ?? []).length === 1 ? '' : 's'}
            </p>
          </div>
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
      <div className="mt-4">
        <AdminPhotoList seriesId={series.id} photos={photos ?? []} />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()
  const { data: series } = useSeries()
  const { data: profile } = useProfile()
  const createSeries = useCreateSeries()
  const uploadPhoto = useUploadPhoto()
  const updateProfilePicture = useUpdateProfilePicture()

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

  const profilePictureStatus: ProfilePictureStatus = updateProfilePicture.isPending
    ? 'pending'
    : updateProfilePicture.isError
      ? 'error'
      : updateProfilePicture.isSuccess
        ? 'success'
        : 'idle'

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-medium text-gray-900">Admin Dashboard</h1>
        <button type="button" onClick={handleSignOut} className="text-sm text-gray-600 underline">
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900">Profile picture</h2>
          <div className="mt-4">
            <ProfilePictureForm
              currentAvatarPath={profile?.avatar_path ?? null}
              status={profilePictureStatus}
              errorMessage={updateProfilePicture.error instanceof Error ? updateProfilePicture.error.message : null}
              onSubmit={(file) =>
                updateProfilePicture.mutate({ file, previousPath: profile?.avatar_path ?? null })
              }
            />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900">Create a series</h2>
          <div className="mt-4">
            <CreateSeriesForm
              status={createSeriesStatus}
              errorMessage={createSeries.error instanceof Error ? createSeries.error.message : null}
              onSubmit={(values) => createSeries.mutate(values)}
            />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900">Upload a photo</h2>
          <div className="mt-4">
            <UploadForm
              series={series ?? []}
              status={uploadStatus}
              errorMessage={uploadPhoto.error instanceof Error ? uploadPhoto.error.message : null}
              onSubmit={(values) => uploadPhoto.mutate(values)}
            />
          </div>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-base font-semibold text-gray-900">Photos</h2>
        {series && series.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">Create a series above to start adding photos.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {series?.map((s) => <SeriesPhotos key={s.id} series={s} />)}
          </div>
        )}
      </section>
    </div>
  )
}
