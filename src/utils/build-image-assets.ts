const VITE_API_URL_UPLOAD = import.meta.env.VITE_API_URL_UPLOAD
export function buildImageAssets(path: string) {
  return `${VITE_API_URL_UPLOAD}/upload/${path}`
}
