import React, { useRef, useState, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Upload, Image } from 'lucide-react'
import Cropper, { type Area } from 'react-easy-crop'

type AvatarSelectorProps = {
  disabled?: boolean
  onImageSelect: (file: File) => void
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image =  document.createElement('img')
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.src = url
  })

async function getCroppedImg(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('No 2d context')

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas empty'))
      resolve(blob)
    }, 'image/jpeg')
  })
}


export function RegisterAvatarSelector({
  disabled = false,
  onImageSelect,
}: AvatarSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  /* -------------------- handlers -------------------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) return

    const url = URL.createObjectURL(file)
    setImageSrc(url)
  }

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedArea(cropped)
  }, [])

  const handleConfirmCrop = async () => {
    if (!imageSrc || !croppedArea) return

    const croppedBlob = await getCroppedImg(imageSrc, croppedArea)

    const file = new File([croppedBlob], 'avatar.jpg', {
      type: 'image/jpeg',
    })

    const previewUrl = URL.createObjectURL(croppedBlob)

    setPreview(previewUrl)
    setImageSrc(null)

    onImageSelect(file)
  }

  const triggerSelect = () => {
    fileInputRef.current?.click()
  }


  return (
    <div className="flex flex-col items-center gap-4">

      {/* Avatar */}
      <Avatar className="h-28 w-28">
        {preview ? (
          <AvatarImage src={preview} />
        ) : (
          <AvatarFallback className="flex items-center justify-center">
            <Image />
          </AvatarFallback>
        )}
      </Avatar>

      {imageSrc && (
        <div className="relative w-full h-[300px] bg-black/10 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!imageSrc ? (
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={triggerSelect}
        >
          <Upload className="mr-2 h-4 w-4" />
          Selecionar imagem
        </Button>
      ) : (
        <Button type="button" onClick={handleConfirmCrop}>
          Confirmar corte
        </Button>
      )}
    </div>
  )
}
