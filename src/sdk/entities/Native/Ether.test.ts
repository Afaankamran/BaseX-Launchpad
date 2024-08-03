import { Ether } from './Ether'

describe('Ether', () => {
  it('static constructor uses cache', () => {
    expect(Ether.onChain(3) === Ether.onChain(3)).toEqual(true)
  })
  it('caches once per chain ID', () => {
    expect(Ether.onChain(3) !== Ether.onChain(2)).toEqual(true)
  })
  it('#equals returns false for diff chains', () => {
    expect(Ether.onChain(3).equals(Ether.onChain(2))).toEqual(false)
  })
  it('#equals returns true for same chains', () => {
    expect(Ether.onChain(3).equals(Ether.onChain(3))).toEqual(true)
  })
})
