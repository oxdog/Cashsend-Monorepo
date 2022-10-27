import {
  useCreateCheckoutMutation,
  useStripePublicKeyQuery,
} from '@generated/graphql'
import Logo from '@public/svg/LogoDark.svg'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import createWithApollo from '@utils/apollo/withApollo'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { IoMdLock, IoMdWarning } from 'react-icons/io'

const IndexPage = () => {
  const router = useRouter()
  const { pid } = router.query

  const [createCheckout] = useCreateCheckoutMutation()
  const { data } = useStripePublicKeyQuery()

  const [stripe, setStripe] = useState<Stripe | null>()
  const [showError, setShowError] = useState<boolean>(false)

  const AmountSchema = Yup.object().shape({
    amount: Yup.string()
      // .min(1, '1€ oder mehr')
      // .max(200, '200€ oder weniger')
      .required('Pflichtfeld')
      .test('maxAmount', '1€ oder mehr', (number) => Number(number) >= 1)
      .test('maxAmount', '200€ oder weniger', (number) => Number(number) <= 200)
      .test('maxDigitsAfterDecimal', 'Nicht mehr als 2 Kommastellen', (number) =>
        number ? Number.isInteger(Number(number) * 100) : false
      ),
    email: Yup.string().email('Ungültige email').required('Pflichtfeld'),
  })

  useEffect(() => {
    const init = async (key: string) => {
      const stripeResponse = await loadStripe(key)
      console.log('stripeResponse', stripeResponse)

      setStripe(stripeResponse)
    }

    if (data?.pay_stripePublicKey) {
      init(data?.pay_stripePublicKey)
    }
  }, [data])

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      {showError && (
        <div
          onClick={() => setShowError(false)}
          className="absolute top-8 inset-x-0 bg-bittersweet text-white flex flex-row items-center mx-4 rounded-lg px-4 py-2 z-20"
        >
          <IoMdWarning className="mr-4 w-6 h-6" />
          Oh nein! Es ist ein unerwarteter Fehler aufgetreten.
        </div>
      )}

      <div className="flex flex-col w-full max-w-xl h-full justify-around py-4 px-8">
        <div className="absolute top-4 left-4 w-8 h-4 z-10">
          <Image src={Logo} alt="Logo" layout="responsive" />
        </div>

        <Formik
          initialValues={{ amount: '1,00', email: '' }}
          validationSchema={AmountSchema}
          onSubmit={async ({ amount, email }) => {
            try {
              if (!pid) {
                throw new Error('No partner ID provided')
              }

              const response = await createCheckout({
                variables: {
                  amount: Number(amount),
                  email,
                  partnerID: pid,
                },
              })

              console.log('response', response)

              if (response.errors) {
                console.log('errors', response.errors)
              }

              const sessionId =
                response.data?.pay_createCheckoutNonCustomer.checkoutSessionID

              if (!sessionId) {
                router.push('/404')
              } else {
                await stripe?.redirectToCheckout({ sessionId })
              }
            } catch (e) {
              console.error('error', e)
              setShowError(true)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="h-full flex flex-col py-8 items-center">
              <div className="flex-grow flex flex-col justify-center">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400"
                >
                  Betrag
                </label>
                <div className="relative mt-1">
                  <Field
                    name="amount"
                    type="number"
                    placeholder="1,00"
                    inputmode="decimal"
                    className="appearance-none text-center bg-white block w-48 px-3 pt-1 text-5xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-jungleGreen focus:border-jungleGreen"
                  />
                  <div className="h-px bg-jungleGreen mx-8" />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="absolute inset-x-0 -bottom-8 whitespace-nowrap text-bittersweet text-center"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <span className="text-gray-400 text-5xl ">€</span>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-8">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Email für Zahlungsbestätigung
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="bob@example.com"
                    required
                    className="appearance-none bg-white text-gray-600 block w-full px-3 py-2 border-b border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-jungleGreen focus:border-jungleGreen"
                  />
                </div>

                <div className="flex flex-col space-y-4 mb-4 w-full">
                  <button
                    type="submit"
                    disabled={!stripe}
                    className="rounded-full px-4 py-2 font-semibold sm:text-4xl bg-jungleGreen hover:bg-jungleGreenBrightest text-white shadow-md"
                  >
                    {!stripe || isSubmitting ? (
                      <div className="animate-spin rounded-full w-6 h-6 border-b border-1 border-white mx-auto" />
                    ) : (
                      <span className="flex flex-row items-center justify-center">
                        <IoMdLock className="text-white w-6 h-6 mr-2" />
                        Sicher Bezahlen
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <span className="mb-8 text-sm sm:text-lg text-center text-gray-400 font-thin">
          &copy; {new Date().getFullYear()} cashsend
        </span>
      </div>
    </div>
  )
}

export default createWithApollo({ ssr: false })(IndexPage)
