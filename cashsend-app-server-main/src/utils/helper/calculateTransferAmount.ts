const DEDUCATION_PERCENT_AMOUNT = 3.42
const DEDUCATION_FIXED_CENT_AMOUNT = 25

export const calculateTransferAmount = (amount: number) => {
  const newAmount = Math.floor(
    amount -
      (amount * DEDUCATION_PERCENT_AMOUNT) / 100 -
      DEDUCATION_FIXED_CENT_AMOUNT
  )

  console.log('amount', amount)
  console.log('newAmount', newAmount)
  console.log('DEDUCATION_PERCENT_AMOUNT', DEDUCATION_PERCENT_AMOUNT)
  console.log('DEDUCATION_FIXED_CENT_AMOUNT', DEDUCATION_FIXED_CENT_AMOUNT)

  return newAmount
}
