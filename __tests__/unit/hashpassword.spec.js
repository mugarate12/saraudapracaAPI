const bcrypt = require('bcryptjs')
const { createHashPassword } = require('./../../src/utils/hashPassword')

describe('tests for a hash password', () => {
  it('should a create valid password', async () => {
    const password = "exemploDesenha123@"
    const incorrectPassword = "exemplodesenha123@"
    const hash = await createHashPassword(password)
  
    const isValidPassword = await bcrypt.compare(password, hash)
    const isInvalidPassword = await bcrypt.compare(incorrectPassword, hash)
    
    expect(isValidPassword).toBe(true)
    expect(isInvalidPassword).toBe(false)
  })
  
})
