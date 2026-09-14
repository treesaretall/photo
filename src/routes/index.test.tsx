import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AppRoutes from './index'

describe('AppRoutes', () => {
  it.each([
    ['/', 'Home'],
    ['/info', 'Info'],
    ['/contacts', 'Contacts'],
    ['/admin/login', 'Admin Login'],
    ['/admin', 'Admin Dashboard'],
  ])('renders the correct page for %s', (path, heading) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })
})
