import getConfig from 'next/config'
import Mail from 'nodemailer/lib/mailer'
import NodeMailer from 'nodemailer'

class Mailer {
  private static mailer: Mail = undefined

  private constructor() { }

  public static async send(to: string, subject: string, content: string) {
    const { serverRuntimeConfig: { GMAIL_USERNAME } } = getConfig()

    const mailer = this.getMailer()
    const options = {
      to,
      subject,
      from: GMAIL_USERNAME,
      html: content
    }

    try {
      await mailer.sendMail(options)
    } catch (err) {
      // TODO: Log the error
    }
  }

  private static getMailer() {
    if (this.mailer === undefined) {
      const { serverRuntimeConfig: { GMAIL_USERNAME, GMAIL_PASSWORD } } = getConfig()

      this.mailer = NodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USERNAME,
          pass: GMAIL_PASSWORD,
        }
      })
    }

    return this.mailer
  }
}

export default Mailer
