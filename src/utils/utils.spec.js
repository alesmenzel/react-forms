import { expect } from 'chai'
import { getArray, getFunction } from './index'

describe('utils', () => {
  const mockString = 'Sample message'
  const mockFunction = (val) => val
  const mockArray = [mockFunction, mockFunction]

  describe('getArray', () => {
    it('should return array for function', done => {
      const res = getArray(mockFunction)
      expect(res).to.be.an('array')
      expect(res).to.have.members([mockFunction])
      done()
    })

    it('should return array for array', done => {
      const res = getArray(mockArray)
      expect(res).to.be.an('array')
      expect(res).to.have.members(mockArray)
      done()
    })
  })

  describe('getFunction', () => {
    it('should return function for function', done => {
      const res = getFunction(mockFunction)
      expect(res).to.be.an('function')
      expect(res).to.be.equal(mockFunction)
      done()
    })

    it('should return function for string', done => {
      const res = getFunction(mockString)
      expect(res).to.be.an('function')

      const message = res()
      expect(message).to.be.equal(mockString)
      done()
    })
  })
})
