// import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import 'tailwindcss/tailwind.css'
import '../customStyles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <ThemeProvider attribute="class"> */}
      <Head>
        {/* meta used by all routes */}
        <link rel="icon" href="favicon-32x32.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta key="robots" name="robots" content="noindex,follow" />
      </Head>
      <Component {...pageProps} />
      {/* </ThemeProvider> */}
    </>
  )
}

export default MyApp
