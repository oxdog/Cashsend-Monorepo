import sg from '@sendgrid/mail'

const from = 'no-reply@cashsend.com'
sg.setApiKey(process.env.SEND_GRID_API_KEY)

export const sendConfirmationEmail = async (
  email: string,
  firstName: string,
  token: string
) => {
  try {
    const msg = {
      to: email,
      from,
      templateId: 'd-30e02b2458754e7b8b32777aa69f8055',
      dynamic_template_data: {
        confirmationUrl: `${process.env.CORS_WEB_ENDPOINT}/confirm-email/${token}`,
        firstName
      }
    }

    await sg.send(msg)

    console.log('email sent')
  } catch (e) {
    console.error('error', e)
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  token: string
) => {
  try {
    const msg = {
      to: email,
      from,
      templateId: 'd-fe8fc6fb10e14d0bb39392c995f299c8',
      dynamic_template_data: {
        resetLink: `${process.env.CORS_WEB_ENDPOINT}/change-password/${token}`,
        email,
        firstName
      }
    }

    await sg.send(msg)

    console.log('email sent')
  } catch (e) {
    console.error('error', e)
  }
}

export const sendEmail = async (email: string, token: string) => {
  sg.setApiKey(process.env.SEND_GRID_API_KEY)
  const msg = {
    to: email, // Change to your recipient
    from, // Change to your verified sender
    subject: 'Bestätige deine Email?',
    text: 'Where does this show up?',
    html: `<a href="${process.env.CORS_WEB_ENDPOINT}/confirm-email/${token}"> Bestätigen </a>`
  }
  sg.send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}
