export const formatMonthYear = (dateString: string) => {
  if (!dateString) return ''
  const formatted = new Date(dateString)
    .toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })
    .replace(' de ', ' ')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
