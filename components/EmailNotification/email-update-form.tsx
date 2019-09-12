import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { updateEmailAddress } from '../../server/api'
import ISourceFile from '../../server/Source/interface/ISourceFile'

interface Props {
  handleEmailUpdateSuccess: Function
  sourceFile: ISourceFile
}

interface States {
  errorMessage: string
  email: string
  isProcessing: boolean
}

class EmailUpdateForm extends React.Component<Props, States> {
  static readonly ERROR_NO_EMAIL: string = 'Please enter an email address to proceed.'

  constructor(props: Props) {
    super(props)

    this.state = {
      email: props.sourceFile.email,
      errorMessage: '',
      isProcessing: false,
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.updateEmail = this.updateEmail.bind(this)
  }

  private handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const errorMessage = ''
    const email = e.target.value

    this.setState({ errorMessage, email })
  }

  private async updateEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    this.setState({
      errorMessage: '',
      isProcessing: true,
    })

    if (this.state.email.length < 1) {
      this.setState({
        errorMessage: EmailUpdateForm.ERROR_NO_EMAIL,
        isProcessing: false,
      })

      return
    }

    try {
      const _id = this.props.sourceFile._id
      const email = this.state.email

      const res = await updateEmailAddress({ _id, email })

      this.props.handleEmailUpdateSuccess(res.data)
    } catch (err) {
      this.setState({ errorMessage: err.response.data.message })
    } finally {
      this.setState({ isProcessing: false })
    }
  }

  render() {
    return (
      <>
        <form className="w-full mb-3" onSubmit={ this.updateEmail }>
          <div className="lg:flex flex-wrap">
            <div className="w-full lg:w-9/12 lg:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email-address">
                Email Address
              </label>

              <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-orange-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-email-address" type="email" placeholder="mail@example.com" value={this.state.email} onChange={this.handleEmailChange} />
            </div>

            <div className="w-full lg:w-3/12 lg:pl-3">
              <button type="submit" className="bg-orange-300 hover:bg-orange-400 text-gray-800 font-bold lg:mt-6 py-3 px-4 rounded inline-flex justify-center items-center w-full">
                <FontAwesomeIcon icon={faBell} />
                <span className="ml-2">Notify me</span>
              </button>
            </div>
          </div>
        </form>

        <p className="text-gray-600">Generally, it takes few minutes. But if it's taking longer then we can forward link on your email address.<br />Fill in your email address above and hit the <span className="font-semibold text-gray-900">Notify me</span> button. You can close the Tab/Browser once done and the process will continue in the background.</p>
      </>
    )
  }
}

export default EmailUpdateForm
