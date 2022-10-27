import { setConfig, buildUrl } from 'cloudinary-build-url'

setConfig({
  cloudName: 'djproto',
})

export const logoUrl = (publicId: string, blur: 'noBlur' | 'blur' = 'noBlur') => {
  const size = blur === 'noBlur' ? 128 : 16
  const blurOptions =
    blur === 'blur'
      ? {
          effect: 'blur:500',
          quality: 1,
        }
      : {}

  return buildUrl(publicId, {
    transformations: {
      ...blurOptions,
      background: 'rgb:ffffff',
      format: 'jpg',
      resize: {
        type: 'pad',
        width: size,
        height: size,
      },
    },
  })
}

export const galleryUrl = (publicId: string, blur: 'noBlur' | 'blur' = 'noBlur') => {
  const width = blur === 'noBlur' ? 390 : 80
  const height = blur === 'noBlur' ? 218 : 40

  const blurOptions =
    blur === 'blur'
      ? {
          effect: 'blur:500',
          quality: 1,
        }
      : {}

  return buildUrl(publicId, {
    transformations: {
      ...blurOptions,
      resize: {
        type: 'fill',
        width,
        height,
      },
    },
  })
}

export const thumbnailUrl = (
  publicId: string,
  blur: 'noBlur' | 'blur' = 'noBlur'
) => {
  const width = blur === 'noBlur' ? 390 : 150
  const height = blur === 'noBlur' ? 218 : 100

  const blurOptions =
    blur === 'blur'
      ? {
          effect: 'blur:500',
          quality: 1,
        }
      : {}

  let url = buildUrl(publicId, {
    transformations: {
      ...blurOptions,
      resize: {
        type: 'fill',
        width,
        height,
      },
    },
  })

  url = url.replace('upload', 'youtube')

  return url
}
