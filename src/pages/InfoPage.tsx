import { getImageUrl } from '../lib/imageUrl'
import { useProfile } from '../hooks/useProfile'

export default function InfoPage() {
  const { data: profile } = useProfile()

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      {profile?.avatar_path && (
        <img
          src={getImageUrl(profile.avatar_path)}
          alt="Matthew Hurst"
          className="h-32 w-32 rounded-full object-cover"
        />
      )}

      <h1 className="mt-6 text-2xl font-medium text-gray-900">Matthew Hurst</h1>
      <p className="mt-1 text-sm text-gray-500">Photographer</p>

      <section className="mt-16">
        <p className="text-gray-700">
          I pick up a camera for the same reason I pick up most things:
          curiosity about how they work. Photography, for me, is less about
          capturing a perfect moment and more about paying closer attention to
          the small details that get lost when you're moving too fast.
        </p>
        <p className="mt-4 text-gray-700">
          Most of what's here started as a walk with no particular destination.
        </p>
        <p className="mt-4 text-gray-700">
          When I'm not behind a camera, I'm usually building something else
          entirely.
        </p>
      </section>
    </div>
  )
}
