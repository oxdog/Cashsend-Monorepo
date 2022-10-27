import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { VscClose } from 'react-icons/vsc'
import { HiOutlineMail } from 'react-icons/hi'
import { BiCheck, BiMailSend } from 'react-icons/bi'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import {
  useConfirmEmailMutation,
  useResendConfirmationLinkMutation,
} from '../../generated/graphql'
import createWithApollo from '@utils/apollo/withApollo'

interface ConfirmEmailProps {}

// @ts-ignore
export const ConfirmEmail: React.FC<ConfirmEmailProps> = () => {
  const router = useRouter()

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [token, setToken] = useState<string>()

  const [confirmEmail, statusConfirm] = useConfirmEmailMutation()
  const [resendConfirmLink, statusResend] = useResendConfirmationLinkMutation()

  const sendEmail = async () => {
    try {
      if (statusResend.loading || !token) {
        throw new Error('Currently not allowed to request new link.')
      }

      await resendConfirmLink({ variables: { token } })
      setIsEmailSent(true)
    } catch (e) {
      console.error('error', e)
    }
  }

  useEffect(() => {
    if (statusConfirm.loading) {
      console.log('status loading')
      return
    }

    const asyncFunction = async (token: string) => {
      try {
        const { data } = await confirmEmail({ variables: { token } })
        console.log('async func data', data)

        if (!data?.auth_confirmEmail.success) {
          throw new Error()
        }
      } catch (e) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    const token = (router.query.token as string) || undefined

    if (token) {
      setToken(token)

      const payload = jwt.decode(token) as { exp: number }
      if (!payload || !payload.exp) {
        setError(true)
        return
      }

      console.log('payload', payload)

      const { exp } = payload

      console.log('exp', exp, moment().isAfter(moment.unix(payload.exp)))

      if (!moment().isAfter(moment.unix(exp))) {
        console.log('token is ok')
        asyncFunction(token)
      } else {
        setError(true)
        setLoading(false)
      }
    }

    //send thing to server
  }, [router.query])

  const renderSuccess = () => (
    <div className="bg-white flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div
          className="absolute w-16 h-16 border-2 rounded-full"
          style={{ borderColor: '#32a37f' }}
        />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full">
          <HiOutlineMail className="text-gray-600 w-8 h-8" color="#32a37f" />
        </div>
        <div
          className="absolute right-0 bottom-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#32a37f' }}
        >
          <BiCheck className="text-gray-600 w-8 h-8" color="#fff" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Email erfolgreich bestätigt.
        </div>
        <div className="text-gray-300 text-m mt-5">
          Du kannst dieses Fenster schließen.
        </div>
      </div>
    </div>
  )

  const renderLoading = () => (
    <div className="bg-white flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute w-16 h-16 border-2 rounded-full animate-ping border-gray-300" />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full">
          <HiOutlineMail className="text-gray-400 w-8 h-8 text-gray-200" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Email wird bestätigt ...
        </div>
        <div className="text-gray-300 text-m mt-5 w-full text-center">
          Einen Moment bitte
        </div>
      </div>
    </div>
  )

  const renderError = () =>
    isEmailSent ? (
      renderSentEmail()
    ) : (
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
            Der Link ist abgelaufen.
          </div>

          <span className="text-gray-300 cursor-pointer text-m mt-5 w-full text-center">
            {!statusResend.loading ? (
              <>
                <span
                  className="underline cursor-pointer text-m mt-5 w-full text-center"
                  style={{ color: '#fece63' }}
                  onClick={sendEmail}
                >
                  Hier klicken
                </span>{' '}
                für einen neuen Link
              </>
            ) : (
              <>Neuer Link wird versendet ... </>
            )}
          </span>
        </div>
      </div>
    )

  const renderSentEmail = () => (
    <div className="bg-white flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div className="relative text-green-400 flex items-center justify-center rounded-full">
          <BiMailSend className="text-gray-400 transform -rotate-45 w-12 h-12" />
        </div>
      </div>
      <div className="flex flex-col mx-4">
        <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Neuer Link versandt.
        </div>
        <div className="text-gray-300 text-m mt-5 w-full text-center">
          In deinen Emails sollte sich demnächst ein neuer Link befinden
        </div>
      </div>
    </div>
  )

  return error ? [renderError()] : loading ? [renderLoading()] : [renderSuccess()]
}

export default createWithApollo({ ssr: false })(ConfirmEmail)
