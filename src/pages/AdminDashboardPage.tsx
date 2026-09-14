import { useNavigate } from 'react-router-dom'
import AdminPhotoList from '../components/AdminPhotoList'
import UploadForm from '../components/UploadForm'
import type { UploadStatus } from '../components/UploadForm'
import { usePhotos } from '../hooks/usePhotos'
import { useSeries } from '../hooks/useSeries'
import { useUploadPhoto } from '../hooks/useUploadPhoto'
import { useAuthStore } from '../stores/authStore'
import type { Series } from '../types/database'

function SeriesPhotos({ series }: { series: Series }) {
  const { data: photos } = usePhotos(series.id)

  return (
    <div className="mt-8">
      <h3 className="text-sm font-medium text-gray-900">{series.title}</h3>
      <AdminPhotoList seriesId={series.id} photos={photos ?? []} />
    </div>
  )
}

export default function AdminDashboardPage() {
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()
  const { data: series } = useSeries()
  const uploadPhoto = useUploadPhoto()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const status: UploadStatus = uploadPhoto.isPending
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
        <h2 className="text-lg font-medium text-gray-900">Upload a photo</h2>
        <div className="mt-4">
          <UploadForm
            series={series ?? []}
            status={status}
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
