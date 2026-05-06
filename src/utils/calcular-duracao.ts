function calculateDuration(start?: string | null, end?: string | null): number | null {
  if (!start || !end) return null

  const [h1, m1] = start.split(':').map(Number)
  const [h2, m2] = end.split(':').map(Number)

  if ([h1, m1, h2, m2].some(isNaN)) return null

  let startMinutes = h1 * 60 + m1
  let endMinutes = h2 * 60 + m2

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60
  }

  const diff = endMinutes - startMinutes

  return diff > 0 ? diff : null
}
export {calculateDuration}