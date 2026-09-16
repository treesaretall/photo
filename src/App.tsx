import { useEffect } from 'react'
import { useProfile } from './hooks/useProfile'
import { getImageUrl } from './lib/imageUrl'
import AppRoutes from './routes'

function App() {
  const { data: profile } = useProfile()

  useEffect(() => {
    if (!profile?.avatar_path) return

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = getImageUrl(profile.avatar_path)
  }, [profile?.avatar_path])

  return <AppRoutes />
}

export default App
