
import { useRegistrationsUC } from '../hooks/use-registrations-uc'
import { definirSemestreLabel } from '../util/semstre-label'
import { Badge } from '@/components/ui/badge'


export function RegistrationsUCtHeader() {
  const {
    semestreActual,
    profileData,
  } = useRegistrationsUC()

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className='flex space-x-2'>
          <h1 className="text-3xl font-bold">Inscrição na UC </h1>
        <Badge variant="secondary" >{`${definirSemestreLabel(semestreActual)}`}</Badge>
        </div>

  
        <p>{profileData?.curso}</p>
      </div>

     
    </div>
  )
}
