export function extractFirstAndLastName(fullName: string) {
  if (!fullName) return { firstName: '', lastName: '' }

  const parts = fullName.trim().split(/\s+/)

  const firstName = parts[0] || ''
  const lastName = parts.length > 1 ? parts[parts.length - 1] : ''

  return { firstName, lastName }
}
