import Logo from '@public/svg/LogoDark.svg'
import Gras from '@public/svg/GrasBackground.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { VscClose } from 'react-icons/vsc'
import Lottie from 'react-lottie'
import * as animationData from '@public/lottie/cow.json'

interface PaymentStatusProps {}

const PaymentStatus: React.FC<PaymentStatusProps> = () => {
  const router = useRouter()

  const [status, setStatus] = useState<'success' | 'cancel' | undefined>()

  const { amount, receiver } = router.query
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  useEffect(() => {
    if (router.query.status) {
      setStatus(router.query.status === 'success' ? 'success' : 'cancel')
    }

    // * If redirect parameter provided
    // * probably

    // const uri =
    //   router.query.redirect && decodeURIComponent(router.query.redirect as string)
    // const waitRedirect = async (uri: string) => {
    //   // await delay(2000)
    //   window.location.href = uri
    // }
    // if (uri) {
    //   waitRedirect(uri)
    // }
  }, [router.query])

  const renderSuccess = () => (
    <div className="bg-white py-8 flex flex-col w-screen h-screen items-center justify-around">
      <div className="flex flex-col items-center">
        <div className="relative w-4/5">
          <Image src={Gras} alt="Logo" layout="responsive" />
          <div className="absolute inset-x-0 bottom-12">
            <div className="w-44 mx-auto">
              <Lottie options={defaultOptions} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-row w-min items-start">
            <FaCheckCircle className="w-8 h-8 text-jungleGreen mr-2" />

            <div className="text-gray-500 text-xl whitespace-nowrap font-semibold w-full text-center">
              Danke für deinen Einkauf!
            </div>
          </div>
          <div className="text-gray-300 text-m mt-2 text-center">
            {amount &&
              receiver &&
              `${Number(amount) / 100}€ erfolgreich an ${receiver} gezahlt.`}
          </div>
          <div className="text-gray-300 text-center">
            Die Bestätigung wird dir per Email zugesendet.
          </div>
        </div>
      </div>

      {/* <div className="space-y-4 flex flex-col justify-center">
        <div className="space-x-1 flex flex-row items-end text-lg sm:text-4xl text-gray-800 font-semibold">
          <span> Nächstes mal </span>
          <span className="text-jungleGreen ">noch schneller</span>
          <span> bezahlen?</span>
        </div>

        <button className="rounded-full px-4 py-2 font-semibold sm:text-4xl bg-jungleGreen hover:bg-jungleGreenBrightest text-white shadow-md">
          JETZT APP HOLEN
        </button>
      </div> */}
    </div>
  )

  const renderCancel = () => (
    <div className="bg-white flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div
          className="absolute w-16 h-16 border-2 rounded-full"
          style={{ borderColor: '#fece63' }}
        />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full">
          <VscClose className="text-gray-600 w-8 h-8" color="#fece63" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Zahlung abgebrochen.
        </div>
        <div className="text-gray-300 text-m mt-5 w-full text-center">
          Du kannst dieses Fenster schließen.
        </div>
      </div>
    </div>
  )

  const renderPlaceholder = () => (
    <div className="bg-white flex flex-col animate-pulse w-screen h-screen items-center justify-center">
      <div className="relative mb-8 w-16 h-16 border-2 border-gray-300 rounded-full" />

      <div className="flex flex-col items-center w-full">
        <div className="bg-gray-300 h-4 w-3/5 rounded-full" />
        <div className="bg-gray-100 h-4 w-2/5 rounded-full mt-5 " />
      </div>
    </div>
  )

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 left-4 w-8 h-4 z-10">
        <Image src={Logo} alt="Logo" layout="responsive" />
      </div>

      {status === 'success'
        ? renderSuccess()
        : status === 'cancel'
        ? renderCancel()
        : renderPlaceholder()}

      <span className="mb-8 text-sm sm:text-lg text-center text-gray-400 font-thin">
        &copy; {new Date().getFullYear()} cashsend
      </span>
    </div>
  )
}

export default PaymentStatus
