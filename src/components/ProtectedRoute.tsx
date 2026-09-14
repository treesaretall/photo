import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ProtectedRoute() {
  const status = useAuthStore((state) => state.status)

  if (status === 'loading') {
    return <p className="px-8 py-8 text-sm text-gray-500">Loading…</p>
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
