import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import Source from '../pages/api/util/Source'

interface Props {
  handleSourceFileVerificationSuccess: Function
}

interface States {
  errorMessage: string
  isProcessing: boolean
  sourceLink: string
}

class VerifySourceLink extends React.Component<Props, States> {
  static readonly ERROR_NO_LINK: string = 'Please enter a URL to proceed.'

  constructor(props: Props) {
    super(props)

    this.state = {
      errorMessage: '',
      isProcessing: false,
      sourceLink: '',
    }

    this.handleSourceLinkChange = this.handleSourceLinkChange.bind(this)
    this.verifySourceFile = this.verifySourceFile.bind(this)
  }

  private handleSourceLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const errorMessage = ''
    const sourceLink = e.target.value

    this.setState({ errorMessage, sourceLink })
  }

  private async verifySourceFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    this.setState({ isProcessing: true })

    if (this.state.sourceLink.length < 1) {
      this.setState({
        errorMessage: VerifySourceLink.ERROR_NO_LINK,
        isProcessing: false,
      })

      return
    }

    try {
      const res = await Source.verifySourceLink(this.state.sourceLink)

      this.props.handleSourceFileVerificationSuccess(res.data)
    } catch (err) {
      this.setState({ errorMessage: err.response.data.message })
    } finally {
      this.setState({ isProcessing: false })
    }
  }

  render() {
    return (
      <div className="bg-white shadow-md rounded mx-auto px-8 py-6 w-full">
        <form className="w-full" onSubmit={this.verifySourceFile}>
          <div className="lg:flex flex-wrap">
            <div className="w-full lg:w-9/12 lg:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-url">
                Source URL
              </label>

              <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-orange-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-url" type="url" placeholder="https://www.example.com/file" value={this.state.sourceLink} onChange={this.handleSourceLinkChange} />
              {this.state.errorMessage.length > 0 && <p className="text-red-500">{this.state.errorMessage}</p>}
            </div>

            <div className="w-full lg:w-3/12 lg:pl-3">
              <button type="submit" className={(this.state.isProcessing ? "bg-orange-200" : "bg-orange-300") + " hover:bg-orange-400 text-gray-800 font-bold lg:mt-6 py-3 px-4 rounded inline-flex justify-center items-center w-full"} disabled={this.state.isProcessing}>
                <FontAwesomeIcon icon={faLink} />
                <span className="ml-2">{this.state.isProcessing ? 'Processing ...' : 'Process'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default VerifySourceLink
