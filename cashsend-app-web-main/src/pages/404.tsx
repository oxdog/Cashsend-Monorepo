import { Layout } from '@components/Layout'
import Logo from '@public/svg/LogoDark.svg'
import { isServer } from '@utils/isServer'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const NotFoundPage = () => {
  const router = useRouter()

  console.log(router.query)
  let { origin } = router.query

  if (!origin) {
    origin = !isServer() ? window.location.toString() : ''
  }

  return (
    <Layout>
      <div className="relative px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="absolute top-4 left-4 w-8 h-4 z-10">
          <Image src={Logo} alt="Logo" layout="responsive" />
        </div>
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-bittersweet  sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-gray-800 my-4 tracking-tight sm:text-5xl">
                  Seite nicht gefunden
                </h1>
                <p className="mt-4 text-base text-gray-400">
                  Die Seite die du suchst gibt es wohl nicht oder es ist etwas schief
                  gelaufen.
                </p>
              </div>
              <div className="flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link passHref={true} href="/">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-bittersweet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bittersweet">
                    zurück zur Startseite
                  </span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage
