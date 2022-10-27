import React from 'react'
import { IoMdLock } from 'react-icons/io'

interface StripeCheckoutProps {}

const StripeCheckout: React.FC<StripeCheckoutProps> = () => {
  // useEffect(() => {
  //   if (router.query.sessionId) {
  //     redirect(router.query.sessionId as string)
  //   }
  // }, [router.query.sessionId])

  // const redirect = async (sessionId: string) => {
  //   const stripe = await getStripe()
  //   await stripe!.redirectToCheckout({
  //     sessionId,
  //   })
  // }

  return (
    <div className="bg-white flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div
          className="absolute w-20 h-20 animate-pulse border-2 rounded-full"
          style={{ borderColor: '#0074D4' }}
        />
        <div className="relative w-20 h-20 flex items-center justify-center rounded-full">
          <IoMdLock className="text-gray-600 w-8 h-8" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Verbindungsaufbau
        </div>
        <div className="text-gray-300 text-m mt-5">Die Bezahlseite wird geladen</div>
      </div>
    </div>
  )
}

export default StripeCheckout
