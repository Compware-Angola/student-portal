export const formatCurrency = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  })
}
