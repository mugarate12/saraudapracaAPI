const { parseISO } = require('date-fns')
const { format } = require('date-fns-tz')

function validateUsername(username) {
  let validUsername = username
  validUsername.trim()

  if (username.length !== validUsername.length) return  { valid: false, error: 'O username não pode ter espaços' }

  const validRange = validUsername.length < 6 || validUsername > 15
  if (validRange) return { valid: false, error: 'o username deve ter entre 6 e 15 letras' }
  
  const numbers = 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9
  if (validUsername[0].includes(numbers)) return { valid: false, error: 'a primeira letra não pode ser um número' }

  const specialCaracteres = '@' || '-' || '#' || '$' || '%' || '&' || '*' || '!' || '?' || '+' || '/' || '|' || ',' || '~' || '^' || '´' || '`' || ':' || ';'
  if (validUsername.includes(specialCaracteres)) return { valid: false, error: 'username não pode ter caracteres especiais com exceção de . e _'}

  // verifica se tem espaços vazios no meio da string
  for (let index = 0; index < validUsername.length; index++) {
    if (validUsername[index] === ' ') return { valid: false, error: 'O username não pode ter espaços' }
  }

  return { valid: true }
}

function validateEventDate(date) {
  let actualDate = new Date()

  try {
    const parsedDate = parseISO(date)
    const pattern = 'dd-MM-yyyy'
    const output = format(parsedDate, pattern, { timeZone: 'America/Sao_Paulo' })
    
    const [day, month, year] = output.split('-')
    if (year < actualDate.getFullYear()) return { valid: false, error: 'Ano não pode ser menor que o atual' }
    if (year === actualDate.getFullYear() && month < (actualDate.getMonth() + 1)) return { valid: false, error: 'Mês não pode ser menor que o atual' }
    if (year === actualDate.getFullYear() && month === (actualDate.getMonth() + 1) && day < actualDate.getDate()) return { valid: false, error: 'Dia não pode ser menor que o atual' }
  } catch (error) {
    return {
      valid: false,
      error: 'Formato de data inválido'
    }
  }

  return { valid: true }
}

function validateHour(partipantHour) {
  validHour = partipantHour
  const [ hour, minutes ] = validHour.split(':')

  if (hour > 24 || hour < 0) return { valid: false, error: 'Hora inválida' }
  if (minutes > 60 || minutes < 0) return { valid: false, error: 'Minutos invalidos' }

  return { valid: true }
}

function validatePassword(password) {
  const validPassword= password

  const passwordRange = validPassword.length < 8
  if (passwordRange) return { valid: false, error: 'A senha precisa ter 8 ou mais caracteres' }

  return { valid: true }
}

module.exports = {
  validateUsername,
  validateEventDate,
  validateHour,
  validatePassword
}
