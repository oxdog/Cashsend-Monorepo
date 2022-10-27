import * as animationData from '@public/lottie/swing.json'
import Logo from '@public/svg/LogoDark.svg'
import createWithApollo from '@utils/apollo/withApollo'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import Lottie from 'react-lottie'
// import Link from 'next/link'

const IndexPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const router = useRouter()

  const { pid, mid } = router.query

  const getScanAndPayText = () => (
    <>
      <span> Jetzt </span>
      <span>
        <span className="text-2xl sm:text-5xl text-jungleGreen ">einfacher</span>
        <span> und </span>
        <span className="text-2xl sm:text-5xl text-jungleGreen ">schneller</span>
      </span>
      <span> als je zuvor mit </span>
      <span className="text-2xl sm:text-5xl text-jungleGreen ">cashsend</span>
      <span> bezahlen!</span>
    </>
  )

  const getHofladenText = () => (
    <>
      <span> Öffne jetzt den </span>
      <span className="text-2xl sm:text-5xl text-jungleGreen ">Hofladen</span>
      <span> mit </span>
      <span>
        <span className="text-2xl sm:text-5xl text-jungleGreen">cashsend</span>
        <span className="text-2xl sm:text-5xl ">!</span>
      </span>
    </>
  )

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col h-full justify-around p-4">
        <div className="absolute top-4 left-4 w-8 h-4 z-10">
          <Image src={Logo} alt="Logo" layout="responsive" />
        </div>

        <div className="mt-4 relative px-4 h-2/5">
          <Lottie options={defaultOptions} />
        </div>

        <div className="space-x-1 mb-4 flex flex-col justify-center items-center text-lg sm:text-4xl text-gray-800 font-semibold">
          {!mid ? [getScanAndPayText()] : [getHofladenText()]}
        </div>

        <div className="flex flex-col space-y-4 mb-4">
          {/* <Link passHref href="/download">
            <button className="rounded-full px-4 py-2 font-semibold sm:text-4xl bg-jungleGreen hover:bg-jungleGreenBrightest text-white shadow-md">
              JETZT APP HOLEN
            </button>
          </Link> */}

          {pid && (
            <a
              href={`/stripe-checkout?pid=${pid}`}
              className="text-center rounded-full border sm:text-2xl border-gray-400 py-2 px-4 text-gray-600"
            >
              Zahlung im Web fortfahren
            </a>
          )}
        </div>

        <span className="mb-8 text-sm sm:text-lg text-center text-gray-400 font-thin">
          &copy; {new Date().getFullYear()} cashsend
        </span>
      </div>
    </div>
  )
}

export default createWithApollo({ ssr: false })(IndexPage)
