export default function Footer() {
  return (
    <footer className="mb-2 mt-2 py-2 text-center text-[1vw] leading-snug tracking-tight text-gray-900/90 max-[480px]:text-[13px]">
      © {new Date().getFullYear()} Matthew Hurst. All rights reserved.
    </footer>
  )
}
