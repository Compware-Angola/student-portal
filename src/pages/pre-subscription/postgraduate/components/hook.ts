import React from "react"
import { FormPreSubscriptionContextPostGraduate } from "./postgraduate-form-provider"

export function useFormPreSubscriptionPostGraduateForm() {
  const context = React.useContext(FormPreSubscriptionContextPostGraduate)

  if (!context) {
    console.log('context', context)
    throw new Error(
      'useFormPreSubscriptionPostGraduateForm deve ser usado dentro de FormPreSubscriptionPostGraduateProvider',
    )
  }

  return context
}
