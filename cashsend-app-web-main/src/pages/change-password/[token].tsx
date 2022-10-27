import { Field, Form, Formik } from 'formik'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiCheck, BiMailSend } from 'react-icons/bi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { VscClose } from 'react-icons/vsc'
import {
  useChangePasswordMutation,
  useResendPasswordResetLinkMutation,
} from '../../generated/graphql'
import { validatePassword } from '@utils/validatePassword'
import createWithApollo from '@utils/apollo/withApollo'

interface ChangePasswordProps {}

const ChangePassword: React.FC<ChangePasswordProps> = () => {
  const router = useRouter()

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false)
  const [error, setError] = useState<'password' | 'token' | 'no_match'>()
  const [loading, setLoading] = useState<boolean>(true)
  const [success, setSuccess] = useState<boolean>(false)

  const [token, setToken] = useState<string>()

  const [resendPasswordLink, statusResend] = useResendPasswordResetLinkMutation()
  const [changePassword] = useChangePasswordMutation()

  useEffect(() => {
    const token = router.query.token as string

    if (token) {
      setToken(token)

      const payload = jwt.decode(token) as { exp: number }

      if (!payload || !payload.exp) {
        setError('token')
        return
      }

      console.log('payload', payload)

      const { exp } = payload

      if (moment().isAfter(moment.unix(exp))) {
        setError('token')
      }

      setLoading(false)
    }
  }, [router.query])

  const sendEmail = async () => {
    try {
      if (statusResend.loading || !token) {
        throw new Error('Currently not allowed to request new link.')
      }

      await resendPasswordLink({ variables: { token } })
      setIsEmailSent(true)
    } catch (e) {
      console.error('error', e)
    }
  }

  const renderSuccess = () => (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div
          className="absolute w-16 h-16 border-2 rounded-full"
          style={{ borderColor: '#32a37f' }}
        />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full">
          <RiLockPasswordLine className="text-gray-600 w-8 h-8" color="#32a37f" />
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
          Passwort erfolgreich geändert.
        </div>
        <div className="text-gray-300 text-m mt-5">
          Du kannst dieses Fenster schließen.
        </div>
      </div>
    </div>
  )

  const renderInput = () => (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div
          className="absolute w-16 h-16 border-2 rounded-full"
          style={{ borderColor: '#32a37f' }}
        />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full">
          <RiLockPasswordLine className="text-gray-600 w-8 h-8" color="#32a37f" />
        </div>
      </div>
      <div className="flex flex-col items-center w-3/5">
        {/* <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Lege hier dein neues Passwort fest
        </div> */}

        <Formik
          initialValues={{ newPassword_1: '', newPassword_2: '' }}
          onSubmit={async ({ newPassword_1, newPassword_2 }) => {
            try {
              setLoading(true)

              if (!validatePassword(newPassword_1)) {
                return setError('password')
              } else if (newPassword_1 !== newPassword_2) {
                return setError('no_match')
              } else {
                setError(undefined)
              }

              const response = await changePassword({
                variables: {
                  token:
                    typeof router.query.token === 'string' ? router.query.token : '',
                  newPassword: newPassword_1,
                },
              })

              console.log('response', response.data)

              if (response.data?.auth_changePassword.success) {
                setSuccess(true)
                setError(undefined)
              } else {
                setError('token')
              }
            } catch (e) {
              console.error('error', e)
            } finally {
              setLoading(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="flex flex-col items-start ">
                <label className="text-gray-300 text-m" htmlFor="newPassword_1">
                  Neues Passwort
                </label>
                <Field
                  className="border-2 border-gray-300 focus:border-gray-500 focus:outline-none rounded-md w-full px-2 text-gray-600"
                  type="password"
                  id="newPassword_1"
                  name="newPassword_1"
                  placeholder=""
                />

                <label className="text-gray-300 mt-2" htmlFor="newPassword_2">
                  Neues Passwort bestätigen
                </label>
                <Field
                  className="border-2 border-gray-300 focus:border-gray-500 focus:outline-none rounded-md w-full px-2 text-gray-600"
                  type="password"
                  id="newPassword_2"
                  name="newPassword_2"
                  placeholder=""
                />

                {error === 'no_match' && (
                  <span className="mt-2 text-center" style={{ color: '#fd6f63' }}>
                    Passwörter stimmen nicht überein.
                  </span>
                )}

                {error === 'password' && (
                  <span className="mt-2 text-center" style={{ color: '#fd6f63' }}>
                    Passwort mindestens 6 Zeichen und 1 Zahl
                  </span>
                )}

                <button
                  className="mt-6 focus:outline-none self-center rounded-md px-2 font-semibold text-lg text-white shadow-md"
                  style={{ backgroundColor: '#32a37f' }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Bestätigen
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )

  const renderLoading = () => (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute w-16 h-16 border-2 rounded-full animate-pulse border-gray-300" />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full">
          <RiLockPasswordLine className="text-gray-400 w-8 h-8 text-gray-200" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-gray-500 text-xl font-semibold w-full text-center">
          Seite wird geladen ...
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
      <div className="flex flex-col w-screen h-screen items-center justify-center">
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
    <div className="flex flex-col w-screen h-screen items-center justify-center">
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

  return loading
    ? renderLoading()
    : error === 'token'
    ? renderError()
    : success
    ? renderSuccess()
    : renderInput()
}

export default createWithApollo({ ssr: false })(ChangePassword)
