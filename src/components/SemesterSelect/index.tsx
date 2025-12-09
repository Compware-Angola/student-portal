import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuerySemesters } from '@/hooks/semester/use-query-semester'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type SemesterSelectProps = {
  onChange: (value: string) => void
}

export function SemesterSelect({onChange}: SemesterSelectProps) {
  const { data, error, isError } = useQuerySemesters()

  return (
    <>
      <Select  onValueChange={(e) => onChange(e)}>
        <SelectTrigger className="min-w-60">
          <SelectValue placeholder="Selecione o semestre" />
        </SelectTrigger>
        <SelectContent>
          {data?.items.map((semester) => (
            <SelectItem
              key={`semester_${semester.codigo}`}
              value={String(semester.codigo)}
            >
              {semester.designacao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
