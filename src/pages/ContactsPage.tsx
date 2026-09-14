export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <h1 className="text-3xl font-medium text-gray-900">
        <a href="mailto:hello@example.com" className="hover:underline">
          hello@example.com
        </a>
      </h1>

      <ul className="mt-10 flex flex-col gap-2 text-gray-600">
        <li>
          <a href="https://instagram.com" className="hover:underline">
            Instagram
          </a>
        </li>
        <li>
          <a href="https://www.behance.net" className="hover:underline">
            Behance
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com" className="hover:underline">
            LinkedIn
          </a>
        </li>
      </ul>
    </div>
  )
}
