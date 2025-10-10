import { Button } from '@/components/ui/button'
import { Edit2, Save, X } from 'lucide-react'

type Props = {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export function EditButtons({ isEditing, onEdit, onSave, onCancel }: Props) {
  return (
    <div className="flex gap-2">
      {!isEditing ? (
        <Button onClick={onEdit} disabled>
          <Edit2 className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
      ) : (
        <>
          <Button
            onClick={onSave}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={onCancel} variant="destructive">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </>
      )}
    </div>
  )
}
