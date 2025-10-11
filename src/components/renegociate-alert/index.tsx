import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Lottie from "lottie-react";
import PaymentFailed from "@/assets/payment_negociate.json"
import { Button } from "../ui/button";
import {useNavigate} from "react-router-dom"
export function RenegociateAlert() {
  const navigate = useNavigate()
  const goBack = () => navigate(-1);
  const goFinance = () => navigate("/financa")
  return <>
    <Card>
      <CardHeader>
        <CardTitle>Negociação de Divida</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center flex-col">
          <Lottie animationData={PaymentFailed} loop={true} style={{ width: 300, height: 300 }} />
          <p className="text-xl">Comunicação interna</p>
          <p className="text-xl">Direcção Administrativa  Financeira</p>
          <p className="text-base text-center mt-2">Os estudantes com dívida referentes aos anos anteriores, que pretendam regularizar suas pendência, deverão quitar 50% ou 100% da dívida, sendo essa Negociação a ser feita de forma automática no Mutue, sendo necessário a confirmação do pagamento dos 50% ou 100% para liberar a confirmação </p>
          <p className="text-base text-center mt-2">Caso concorde, escolha uma das duas opções para obter a factura de 50% ou 100% das dívidas</p>


        </div>
        <div className="flex justify-end space-x-2 mt-12">
          <Button variant="secondary" onClick={goBack} >50% da Divida</Button>
          <Button onClick={goFinance}>100% da Divida</Button>
        </div>
      </CardContent>
    </Card>
  </>
}