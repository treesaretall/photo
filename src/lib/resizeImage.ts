export interface Dimensions {
  width: number
  height: number
}

export function calculateResizedDimensions(width: number, height: number, maxDimension: number): Dimensions {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }

  const scale = maxDimension / Math.max(width, height)

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

export async function resizeImage(file: Blob, maxDimension: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = calculateResizedDimensions(bitmap.width, bitmap.height, maxDimension)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not get a 2D canvas context')
  }

  context.drawImage(bitmap, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create resized image blob'))
        }
      },
      'image/jpeg',
      0.85,
    )
  })
}
