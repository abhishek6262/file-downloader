import getConfig from 'next/config'
import Pusher from 'pusher-js'
import React from 'react'
import { countSourceFiles } from '../server/api'
import ISourceFile from '../server/Source/interface/ISourceFile'
import EmailNotification from './EmailNotification/email-notification'
import NewSourceLink from './new-source-link'

interface Props {
  handleSourceFileUnlockSuccess: Function
  sourceFile: ISourceFile
}

interface States {
  completionPercentage: number
  queuePosition: number
}

class UnlockSourceLink extends React.Component<Props, States> {
  private monitorQueuedFilesInterval: NodeJS.Timeout

  constructor(props: Props) {
    super(props)

    this.state = {
      completionPercentage: 0,
      queuePosition: 0,
    }

    this.monitorQueuedFiles = this.monitorQueuedFiles.bind(this)
    this.resetQueuePosition = this.resetQueuePosition.bind(this)

    this.monitorQueuedFilesInterval = this.monitorQueuedFiles()

    // Establish Web Socket connection with the running background
    // process.

    const {
      publicRuntimeConfig: {
        PUSHER_CLUSTER,
        PUSHER_EVENT_NAME,
        PUSHER_KEY,
      }
    } = getConfig()

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true
    })

    const channel = pusher.subscribe('my-channel')

    channel.bind(PUSHER_EVENT_NAME, ({ _id, completionPercentage, downloadLink, status }) => {
      if (this.props.sourceFile._id !== _id) {
        return
      }

      this.resetQueuePosition()

      if (status === 'completed') {
        this.props.handleSourceFileUnlockSuccess(downloadLink)
      }

      this.setState({ completionPercentage })
    })
  }

  private monitorQueuedFiles() {
    const setQueuedFiles = async () => {
      const res         = await countSourceFiles('pending')
      const queuedFiles = res.data.totalQueuedFiles

      this.setState({ queuePosition: queuedFiles })

      return queuedFiles
    }

    const monitorQueuedFiles = setInterval(async () => {
      try {
        const queuedFiles = await setQueuedFiles()

        if (queuedFiles === 1) {
          clearInterval(monitorQueuedFiles)
        }
      } catch (err) {
        console.log(err.response || err)
      }
    }, 15000)

    setQueuedFiles()

    return monitorQueuedFiles
  }

  private resetQueuePosition() {
    if (this.state.queuePosition > 0) {
      clearInterval(this.monitorQueuedFilesInterval)

      this.setState({ queuePosition: 0 })
    }
  }

  render() {
    const { completionPercentage, queuePosition } = this.state

    let content: JSX.Element

    if (this.props.sourceFile.downloadLink.length > 0) {
      content = <NewSourceLink sourceFile={this.props.sourceFile} />
    } else {
      content = <EmailNotification sourceFile={this.props.sourceFile} />
    }

    return (
      <div className="bg-white shadow-md rounded mx-auto px-8 py-6 w-full">
        <div className="mb-5">
          <div className="flex justify-between">
            <div>
              <p>Queue Position: <span className="font-semibold">{queuePosition}</span></p>
            </div>

            <div>
              <p className="text-right mb-3 uppercase font-semibold">{completionPercentage + '%'} <span className="text-gray-600">Completed</span></p>
            </div>
          </div>

          <div className="w-full bg-gray-400 overflow-hidden rounded">
            <div className="bg-orange-400 py-1" style={{ width: completionPercentage + '%' }}></div>
          </div>
        </div>

        <hr className="mb-5" />

        {content}
      </div>
    )
  }
}

export default UnlockSourceLink
