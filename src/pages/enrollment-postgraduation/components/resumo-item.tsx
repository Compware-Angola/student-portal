export function ResumoItem({
  label,
  value,
  destaque = false,
}: {
  label: string
  value: string
  destaque?: boolean
}) {
  return (
    <div
      className={`flex justify-between text-lg ${
        destaque ? 'font-extrabold text-primary' : 'font-semibold'
      }`}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  )
}
