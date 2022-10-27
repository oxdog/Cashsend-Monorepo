import * as Sentry from 'sentry-expo'

const sentryEnabled = !__DEV__

// if (sentryEnabled) {
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: __DEV__
})
// }

const prepArgs = (...args: any[]) =>
  args
    .map((a) => {
      if (typeof a === 'string') {
        return a
      } else {
        return JSON.stringify(a)
      }
    })
    .join(' ')

export const log = {
  info: (...args: any[]) => {
    sentryEnabled
      ? Sentry.Native.captureMessage(prepArgs(...args))
      : console.log(...args)
  },
  error: (...args: any[]) => {
    sentryEnabled
      ? Sentry.Native.captureException(new Error(prepArgs(...args)))
      : console.error(...args)
  }
}
