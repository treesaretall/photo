import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="flex items-center justify-between px-8 py-10">
      <Link to="/" className="text-2xl font-medium tracking-tight text-gray-900">
        Photography Portfolio
      </Link>
      <nav className="flex gap-8 text-sm text-gray-600">
        <Link to="/info" className="hover:text-gray-900">
          Info
        </Link>
        <Link to="/contacts" className="hover:text-gray-900">
          Contacts
        </Link>
      </nav>
    </header>
  )
}
