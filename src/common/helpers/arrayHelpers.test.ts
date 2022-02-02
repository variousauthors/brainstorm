import { immutableRemove, immutableReplace } from './arrayHelpers'

const makeElement = (id: number) => ({ id })

describe('immutableReplace', () => {
  it ('should replace the element', () => {
    const array = [makeElement(1), makeElement(2), makeElement(3)]

    const result = immutableReplace(array, array[1], makeElement(4))

    expect(result[1]?.id).toBe(4)
  })

  it ('it should not modify the original array', () => {
    const array = [makeElement(1), makeElement(2), makeElement(3)]

    immutableReplace(array, array[1], makeElement(4))

    expect(array[1]?.id).toBe(2)
  })

  it ('it finds the elements by reference, not by value', () => {
    const array = [makeElement(1), makeElement(2), makeElement(3)]

    const result = immutableReplace(array, makeElement(2), makeElement(4))

    expect(result[1]?.id).toBe(2)
  })
})

describe('immutableRemove', () => {

  it ('returns an array with the given element removed', () => {
    const array = [makeElement(1), makeElement(2), makeElement(3)]

    const result = immutableRemove(array, array[1])

    expect(result).toEqual([makeElement(1), makeElement(3)])
  })

  it ('it should not modify the original array', () => {
    const array = [makeElement(1), makeElement(2), makeElement(3)]

    immutableRemove(array, array[1])

    expect(array).toEqual([makeElement(1), makeElement(2), makeElement(3)])
  })

  it ('it finds the elements by reference, not by value', () => {
    const array = [makeElement(1), makeElement(2), makeElement(3)]

    const result = immutableRemove(array, makeElement(2))

    expect(result).toEqual([makeElement(1), makeElement(2), makeElement(3)])
  })
})
