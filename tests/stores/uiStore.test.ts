import { afterEach, describe, expect, it } from 'vitest'
import { useUiStore } from '../../src/stores/uiStore'

afterEach(() => {
  useUiStore.setState({ lightboxOpenPhotoId: null })
})

describe('uiStore', () => {
  it('starts with the lightbox closed', () => {
    expect(useUiStore.getState().lightboxOpenPhotoId).toBeNull()
  })

  it('opens the lightbox for a given photo id', () => {
    useUiStore.getState().openLightbox('p1')

    expect(useUiStore.getState().lightboxOpenPhotoId).toBe('p1')
  })

  it('switches the open photo id when opened again', () => {
    useUiStore.getState().openLightbox('p1')
    useUiStore.getState().openLightbox('p2')

    expect(useUiStore.getState().lightboxOpenPhotoId).toBe('p2')
  })

  it('closes the lightbox', () => {
    useUiStore.getState().openLightbox('p1')
    useUiStore.getState().closeLightbox()

    expect(useUiStore.getState().lightboxOpenPhotoId).toBeNull()
  })
})
