import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Lottie from 'lottie-react'
import PaymentFailed from '@/assets/payment_failed.json'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
export function PaymentAlert() {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)
  const goFinance = () => navigate('/financas')
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center flex-col">
            <Lottie
              animationData={PaymentFailed}
              loop={true}
              style={{ width: 300, height: 300 }}
            />
            <p className="text-xl">
              Caro estudante, a sua situação financeira está Irregular
            </p>
            <p className="text-xl">
              Para mais informações acessar a página financeira
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-12">
            <Button variant="secondary" onClick={goBack}>
              Voltar
            </Button>
            <Button onClick={goFinance}>página financeira</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
