import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import ContactsPage from '../pages/ContactsPage'
import HomePage from '../pages/HomePage'
import InfoPage from '../pages/InfoPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
