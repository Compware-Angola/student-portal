import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, ArrowLeft, CheckCheck } from 'lucide-react'
import { PersonalDetails } from './components/personal-details'
import { AcademicData } from './components/academic-data'
import { AcademicDocument } from './components/academic-document'
import { cn } from '@/lib/utils'
import {
  FormPreSubscriptionProvider,
  useFormPreSubscriptionForm,
} from './components/form-provider'
import { ProgressBar } from './components/progress-bar'
import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/input-form-field'
import { SpepNavigation } from './components/spep-navigation'

export function PreSubscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pré-Inscrição</h1>
        <p className="text-muted-foreground mt-2">
          Preencha o formulário para realizar a pré-inscrição ao exame de acesso
        </p>
      </div>
      <FormPreSubscriptionProvider>
        <Temp />
      </FormPreSubscriptionProvider>
    </div>
  )
}

function Temp() {
  const { steps, currentStep, form, onSubmit } = useFormPreSubscriptionForm()
  return (
    <>
      <ProgressBar />

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {steps[currentStep].component}

              {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={personalForm.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bi">
                              Bilhete de Identidade
                            </SelectItem>
                            <SelectItem value="passaporte">Passaporte</SelectItem>
                            <SelectItem value="dire">DIRE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Documento</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>*/}

              {/*<FormField
                  control={personalForm.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a nacionalidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />*/}

              {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={personalForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="+244 900 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>*/}

              {/*<FormField
                  control={personalForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />*/}

              {/*<FormField
                  control={personalForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Luanda, Benguela, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />*/}

              <SpepNavigation />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
