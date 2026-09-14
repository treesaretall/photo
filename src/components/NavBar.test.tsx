import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NavBar from './NavBar'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <NavBar />
    </MemoryRouter>,
  )
}

describe('NavBar', () => {
  it('shows Info, the title, and Contacts on the home page', () => {
    renderAt('/')

    expect(screen.getByRole('link', { name: 'Info' })).toHaveAttribute('href', '/info')
    expect(screen.getByRole('link', { name: 'Matthew Hurst' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute('href', '/contacts')
  })

  it('drops the Info link and moves the title to the left slot on the info page', () => {
    renderAt('/info')

    expect(screen.queryByRole('link', { name: 'Info' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Matthew Hurst' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute('href', '/contacts')
  })

  it('drops the Contacts link and moves the title to the left slot on the contacts page', () => {
    renderAt('/contacts')

    expect(screen.queryByRole('link', { name: 'Contacts' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Matthew Hurst' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Info' })).toHaveAttribute('href', '/info')
  })
})
