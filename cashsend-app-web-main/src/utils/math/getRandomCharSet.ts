import { getRandomInt } from './getRandomInt'

export const getRandomCharSet = (minLength: number, maxLength: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charArray = characters.split('')

  const randomChars = []

  for (let i = 0; i < getRandomInt(minLength, maxLength); i++) {
    randomChars.push(charArray[getRandomInt(0, charArray.length - 1)])
  }

  return randomChars.join('')
}
