import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import ProfilePictureForm from './ProfilePictureForm'

vi.mock('../lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => 'blob:mock-preview')
  URL.revokeObjectURL = vi.fn()
})

function createFile() {
  return new File(['image-bytes'], 'avatar.jpg', { type: 'image/jpeg' })
}

describe('ProfilePictureForm', () => {
  it('shows the current avatar when no new file has been chosen', () => {
    render(<ProfilePictureForm currentAvatarPath="profile/abc.jpg" status="idle" onSubmit={vi.fn()} />)

    expect(screen.getByAltText('Profile picture preview')).toHaveAttribute(
      'src',
      'https://example.com/profile/abc.jpg',
    )
  })

  it('renders no preview image when there is no current avatar and no selection', () => {
    render(<ProfilePictureForm currentAvatarPath={null} status="idle" onSubmit={vi.fn()} />)

    expect(screen.queryByAltText('Profile picture preview')).not.toBeInTheDocument()
  })

  it('shows a local preview and calls onSubmit with the chosen file', () => {
    const onSubmit = vi.fn()
    render(<ProfilePictureForm currentAvatarPath={null} status="idle" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Photo'), { target: { files: [createFile()] } })
    expect(screen.getByAltText('Profile picture preview')).toHaveAttribute('src', 'blob:mock-preview')

    fireEvent.click(screen.getByRole('button', { name: 'Save profile picture' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].name).toBe('avatar.jpg')
  })

  it('disables the submit button until a file is chosen', () => {
    render(<ProfilePictureForm currentAvatarPath={null} status="idle" onSubmit={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Save profile picture' })).toBeDisabled()
  })

  it('shows an error message when status is "error"', () => {
    render(
      <ProfilePictureForm
        currentAvatarPath={null}
        status="error"
        errorMessage="Something went wrong"
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows a success message when status is "success"', () => {
    render(<ProfilePictureForm currentAvatarPath={null} status="success" onSubmit={vi.fn()} />)

    expect(screen.getByText('Profile picture updated.')).toBeInTheDocument()
  })

  it('disables the submit button while pending', () => {
    render(<ProfilePictureForm currentAvatarPath="profile/abc.jpg" status="pending" onSubmit={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Uploading…' })).toBeDisabled()
  })
})
