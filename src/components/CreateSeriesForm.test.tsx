import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CreateSeriesForm from './CreateSeriesForm'

describe('CreateSeriesForm', () => {
  it('calls onSubmit with trimmed title/location and a parsed year', () => {
    const onSubmit = vi.fn()
    render(<CreateSeriesForm status="idle" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '  Quiet Places  ' } })
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: '  Berlin  ' } })
    fireEvent.change(screen.getByLabelText('Year'), { target: { value: '2022' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create series' }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Quiet Places', location: 'Berlin', year: 2022 })
  })

  it('does not call onSubmit when the title is blank', () => {
    const onSubmit = vi.fn()
    render(<CreateSeriesForm status="idle" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Berlin' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create series' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows an error message when status is "error"', () => {
    render(<CreateSeriesForm status="error" errorMessage="Something went wrong" onSubmit={vi.fn()} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows a success message when status is "success"', () => {
    render(<CreateSeriesForm status="success" onSubmit={vi.fn()} />)

    expect(screen.getByText('Series created.')).toBeInTheDocument()
  })

  it('disables the submit button while pending', () => {
    render(<CreateSeriesForm status="pending" onSubmit={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Creating…' })).toBeDisabled()
  })
})
