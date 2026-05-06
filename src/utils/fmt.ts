export function fmt(dateStr?: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('pt-AO')
}