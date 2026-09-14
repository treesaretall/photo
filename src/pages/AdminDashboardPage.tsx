import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function AdminDashboardPage() {
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-medium text-gray-900">Admin Dashboard</h1>
      <button type="button" onClick={handleSignOut} className="mt-6 text-sm text-gray-600 underline">
        Sign out
      </button>
    </div>
  )
}
