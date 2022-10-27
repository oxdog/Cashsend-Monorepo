import * as animationData from '@public/lottie/swing.json'
import Logo from '@public/svg/LogoDark.svg'
import createWithApollo from '@utils/apollo/withApollo'
import Image from 'next/image'
import React from 'react'
import Lottie from 'react-lottie'
import { FaGooglePlay, FaApple } from 'react-icons/fa'
import Link from 'next/link'

const IndexPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

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
          <span> Erhalte Zugang zu </span>
          <span className="text-3xl sm:text-5xl sm:my-1 text-jungleGreen ">
            cashsend
          </span>
          <span> vor allen anderen! </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 mb-2">Erhalte jetzt die Beta Version!</span>
          <div className="flex flex-col space-y-4">
            <Link
              passHref
              href="https://play.google.com/store/apps/details?id=com.cashsend.cashsend"
            >
              <button className="text-center font-semibold flex flex-row items-center justify-center rounded-full border sm:text-2xl border-gray-400 py-2 px-8 text-gray-600">
                <FaGooglePlay className="mr-2 text-jungleGreen" />
                Google Play
              </button>
            </Link>

            {/* <Link passHref href="#"> */}
            <button className="opacity-50 text-center flex flex-row items-center justify-center rounded-full border sm:text-2xl border-gray-400 py-2 px-8 text-gray-600">
              <FaApple className="mr-2 text-gray-400 w-6 h-6" />
              App Store
              <span className="text-gray-400 ml-2"> bald verfügbar </span>
            </button>
            {/* </Link> */}
          </div>
        </div>

        <span className="text-sm sm:text-lg text-center text-gray-400 font-thin">
          &copy; {new Date().getFullYear()} cashsend
        </span>
      </div>
    </div>
  )
}

export default createWithApollo({ ssr: false })(IndexPage)
