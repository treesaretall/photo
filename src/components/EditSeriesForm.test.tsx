import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Series } from '../types/database'
import EditSeriesForm from './EditSeriesForm'

const series: Series = {
  id: 's1',
  title: 'Quiet Places',
  location: 'Berlin',
  year: 2022,
  position: 0,
  created_at: '2020-01-01',
}

describe('EditSeriesForm', () => {
  it('pre-fills the fields with the series values', () => {
    render(<EditSeriesForm series={series} status="idle" onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByLabelText('Title')).toHaveValue('Quiet Places')
    expect(screen.getByLabelText('Location')).toHaveValue('Berlin')
    expect(screen.getByLabelText('Year')).toHaveValue(2022)
  })

  it('calls onSubmit with trimmed title/location and a parsed year', () => {
    const onSubmit = vi.fn()
    render(<EditSeriesForm series={series} status="idle" onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '  New Title  ' } })
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: '  Paris  ' } })
    fireEvent.change(screen.getByLabelText('Year'), { target: { value: '2024' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'New Title', location: 'Paris', year: 2024 })
  })

  it('does not call onSubmit when the title is cleared', () => {
    const onSubmit = vi.fn()
    render(<EditSeriesForm series={series} status="idle" onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    render(<EditSeriesForm series={series} status="idle" onSubmit={vi.fn()} onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('shows an error message when status is "error"', () => {
    render(
      <EditSeriesForm
        series={series}
        status="error"
        errorMessage="Something went wrong"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('disables the submit button while pending', () => {
    render(<EditSeriesForm series={series} status="pending" onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  })
})
