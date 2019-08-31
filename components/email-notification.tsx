import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import ISourceFile from '../util/Source/interface/ISourceFile'

interface Props {
  sourceFile: ISourceFile
}

class EmailNotification extends React.Component<Props> {
  render() {
    return (
      <div>
        <form className="w-full mb-3">
          <div className="lg:flex flex-wrap">
            <div className="w-full lg:w-9/12 lg:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email-address">
                Email Address
              </label>

              <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-orange-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-email-address" type="email" placeholder="mail@example.com" />
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
      </div>
    )
  }
}

export default EmailNotification
