import { expect } from 'chai'
import { isRequired } from './required'

describe('isRequired', () => {
  const checkRequired = isRequired('Field is required')

  it('should fail for empty string', async () => {
    const input = { value: '' }

    const err = await checkRequired(input)
    expect(err).to.be.equal('Field is required')
  })
  it('should pass for zero', async () => {
    const input = { value: 0 }

    const err = await checkRequired(input)
    expect(err).to.be.an('undefined')
  })
  it('should pass for string', async () => {
    const input = { value: 'test' }

    const err = await checkRequired(input)
    expect(err).to.be.an('undefined')
  })
})
