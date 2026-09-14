export default function InfoPage() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <h1 className="text-2xl font-medium text-gray-900">Jane Doe</h1>
      <p className="mt-1 text-sm text-gray-500">Photographer</p>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400">2024</h2>
        <p className="mt-3 text-gray-700">
          Group exhibition, <span className="italic">Light and Shadow</span>, Reykjavik.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400">2022</h2>
        <p className="mt-3 text-gray-700">
          Solo exhibition, <span className="italic">Quiet Places</span>, Berlin.
        </p>
        <p className="mt-3 text-gray-700">
          Featured in{' '}
          <a href="#" className="underline hover:text-gray-900">
            Aperture Journal
          </a>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400">2019</h2>
        <p className="mt-3 text-gray-700">Began working on long-term documentary projects.</p>
      </section>
    </div>
  )
}
