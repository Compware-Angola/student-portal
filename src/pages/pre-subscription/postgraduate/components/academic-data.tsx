// import { InputFormField } from '@/components/input-form-field'
// import { useFormPreSubscriptionPostGraduateForm } from './hook'
// import { FileInput } from '@/components/input-file'

// export function AcademicData() {
//   const { form } = useFormPreSubscriptionPostGraduateForm()

//   return (
//     <>
//       <InputFormField
//         label="Instituição de Ensino"
//         control={form.control}
//         name="previousSchool"
//         placeholder="Nome da escola"
//         type="text"
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <InputFormField
//           label="Ano de Conclusão"
//           control={form.control}
//           name="graduationYear"
//           placeholder="2024"
//           type="date"
//         />
//         <InputFormField
//           label="Media Final"
//           control={form.control}
//           name="averageGrade"
//           placeholder="16.5"
//           type="number"
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FileInput
//           label="Certificado"
//           required
//           accept=".pdf"
//           maxSizeMB={5}
//           error={form.formState.errors.certificate?.message}
//           onChange={(file) =>
//             form.setValue('certificate', file!, {
//               shouldValidate: true,
//               shouldDirty: true,
//             })
//           }
//         />
//       </div>
//     </>
//   )
// }
