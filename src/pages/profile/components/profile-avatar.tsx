import React, { useState, useCallback, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import Cropper, { type Area } from 'react-easy-crop'
import { Upload, Loader2 } from 'lucide-react'
import { useUploadSingle } from '@/hooks/upload/use-upload-single'
import { toast } from 'sonner'
import { useUpdateStudentPhoto } from '@/hooks/student/use-mutation-update-student-photo'

type ProfileAvatarProps = {
  firstName: string
  lastName: string
  curriculumYear?: string
  enrollmentState?: string
  curso?: string
  polo?: string
  isEditing: boolean
  currentPhotoUrl?: string
  userId: string
}

// Função auxiliar para criar a imagem cortada
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      1,
    )
  })
}

export function ProfileAvatar({
  firstName,
  lastName,
  curriculumYear,
  enrollmentState,
  curso,
  polo,
  isEditing,
  currentPhotoUrl,
  userId,
}: ProfileAvatarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(
    currentPhotoUrl || null,
  )
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadMutation = useUploadSingle()
  const updateStudentPhoto = useUpdateStudentPhoto()
  const displayText = curriculumYear || enrollmentState

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido.')
        return
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast('A imagem deve ter no máximo 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setIsDialogOpen(true)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropConfirm = async () => {
    if (!selectedImage || !croppedAreaPixels) return

    try {
      // Criar a imagem cortada
      const croppedImageBlob = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
      )

      // Criar arquivo para upload
      const croppedFile = new File(
        [croppedImageBlob],
        `profile-${Date.now()}.jpg`,
        {
          type: 'image/jpeg',
        },
      )

      // Fazer upload usando a mutation
      const response = await uploadMutation.mutateAsync(croppedFile)

      // Criar URL temporária para preview imediato
      const croppedUrl = URL.createObjectURL(croppedImageBlob)
      setCroppedImageUrl(croppedUrl)

      // Chamar callback com o path do arquivo no servidor
      if (response.file.path) {
        updateStudentPhoto.mutateAsync({ file: response.file.filename, userId })
      }

      toast('Foto atualizada com sucesso!')

      setIsDialogOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      toast('Foto atualizada com sucesso!')
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Foto do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {croppedImageUrl ? (
                  <AvatarImage
                    src={croppedImageUrl}
                    alt={`${firstName} ${lastName}`}
                  />
                ) : (
                  <AvatarFallback className="text-3xl">
                    {`${firstName[0]}${lastName[0]}`}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-semibold">{`${firstName} ${lastName}`}</h3>
            {curso && <p className="text-sm text-muted-foreground">{curso}</p>}
            {polo && <p className="text-sm text-muted-foreground">{polo}</p>}
            {displayText && (
              <p className="text-sm text-muted-foreground">{displayText}</p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={!isEditing || uploadMutation.isPending}
          />

          <Button
            className="w-full"
            disabled={!isEditing || uploadMutation.isPending}
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {croppedImageUrl ? 'Alterar Foto' : 'Adicionar Foto'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajustar Foto do Perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
              {selectedImage && (
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom</label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCropConfirm}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
