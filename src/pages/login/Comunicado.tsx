// Comunicado.tsx

import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useGetAvisoImagem } from '@/hooks/use-get-aviso-imagem'
import { getHomeRoute } from '@/routes/permission'
import { buildImageAssets } from '@/utils/build-image-assets'
import { useNavigate } from 'react-router-dom'

export function Comunicado() {
  const navigate = useNavigate()
  const { data: comunicado } = useGetAvisoImagem()
  const { studentStatus } = useQueryProfile()
  const homeRoute = getHomeRoute(studentStatus!)
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/banner-login.webp')", // <- imagem estática
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Caixa central */}
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={() => navigate(homeRoute)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2d3e50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          PÁGINA PRINCIPAL
        </button>

        {comunicado?.filename && (
          <div
            
          >
            <img
              src={buildImageAssets(comunicado.filename)}
              alt="Comunicado"
              style={{
                width: '100%',
                borderRadius: '8px',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
