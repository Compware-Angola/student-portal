interface PasswordStrengthProps {
  password: string
  showDetails?: boolean // Para mostrar detalhes adicionais
}

export function PasswordStrength({ password, showDetails = false }: PasswordStrengthProps) {
  if (!password) return null

  const calculateStrength = () => {
    let score = 0
    const details = {
      length: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
      noRepetition: true,
      noCommonPattern: true,
      mixedCase: false,
      hasAllTypes: false,
    }

    // Avaliação detalhada
    if (password.length >= 8) { 
      score++; 
      details.length = true 
    }
    if (password.length >= 12) { 
      score++; 
      details.length = true 
    }
    
    if (/[A-Z]/.test(password)) { 
      score++; 
      details.hasUppercase = true 
    }
    if (/[a-z]/.test(password)) { 
      score++; 
      details.hasLowercase = true 
    }
    if (/[0-9]/.test(password)) { 
      score++; 
      details.hasNumber = true 
    }
    if (/[^a-zA-Z0-9]/.test(password)) { 
      score++; 
      details.hasSpecial = true 
    }

    // Verificações avançadas
    if (/(?=.*[A-Z])(?=.*[a-z])/.test(password)) {
      score++;
      details.mixedCase = true
    }
    
    if (/(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) {
      score += 2
      details.hasAllTypes = true
    }

    // Penalidades
    if (/(.)\1{2,}/.test(password)) {
      score = Math.max(0, score - 1)
      details.noRepetition = false
    }

    // Verifica padrões comuns (melhorado)
    const commonPatterns = [
      '123456', 'password', 'senha', 'admin', 
      'qwerty', 'abc123', 'teste', '123123',
      '000000', '111111', 'letmein', 'welcome'
    ]
    if (commonPatterns.some(pwd => password.toLowerCase().includes(pwd))) {
      score = Math.max(0, score - 2)
      details.noCommonPattern = false
    }

    // Verifica se é sequencial (ex: abcdef, 123456)
    if (/^(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      score = Math.max(0, score - 1)
      details.noCommonPattern = false
    }

    if (/^(?:012|123|234|345|456|567|678|789|890)/.test(password)) {
      score = Math.max(0, score - 1)
      details.noCommonPattern = false
    }

    // Normaliza para 0-10
    score = Math.max(0, Math.min(10, score))

    // Níveis
    let level, color, textColor, percentage
    
    if (score <= 1) {
      level = 'Muito Fraca'
      color = 'bg-red-600'
      textColor = 'text-red-600'
      percentage = 10
    } else if (score <= 3) {
      level = 'Fraca'
      color = 'bg-red-500'
      textColor = 'text-red-500'
      percentage = 30
    } else if (score <= 5) {
      level = 'Média'
      color = 'bg-yellow-500'
      textColor = 'text-yellow-600'
      percentage = 50
    } else if (score <= 7) {
      level = 'Forte'
      color = 'bg-green-500'
      textColor = 'text-green-600'
      percentage = 75
    } else {
      level = 'Muito Forte'
      color = 'bg-green-600'
      textColor = 'text-green-700'
      percentage = 100
    }

    return { level, color, textColor, percentage, score, details }
  }

  const strength = calculateStrength()

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-in-out ${strength.color}`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${strength.textColor} min-w-[80px] text-right`}>
          {strength.level}
        </span>
      </div>

      {/* Detalhes opcionais para feedback mais preciso */}
      {showDetails && password.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <span className={strength.details.hasUppercase ? 'text-green-600' : 'text-gray-400'}>
              {strength.details.hasUppercase ? '✓' : '○'} Maiúscula
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={strength.details.hasLowercase ? 'text-green-600' : 'text-gray-400'}>
              {strength.details.hasLowercase ? '✓' : '○'} Minúscula
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={strength.details.hasNumber ? 'text-green-600' : 'text-gray-400'}>
              {strength.details.hasNumber ? '✓' : '○'} Número
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={strength.details.hasSpecial ? 'text-green-600' : 'text-gray-400'}>
              {strength.details.hasSpecial ? '✓' : '○'} Especial
            </span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className={strength.details.noRepetition ? 'text-green-600' : 'text-red-500'}>
              {strength.details.noRepetition ? '✓' : '⚠'} Sem caracteres repetidos
            </span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className={strength.details.noCommonPattern ? 'text-green-600' : 'text-red-500'}>
              {strength.details.noCommonPattern ? '✓' : '⚠'} Sem padrões comuns
            </span>
          </div>
        </div>
      )}
    </div>
  )
}