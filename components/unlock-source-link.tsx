import React from 'react'
import { countSourceFiles } from '../app/api'
import ISourceFile from '../app/Source/interface/ISourceFile'
import NewSourceLink from './new-source-link'
import EmailNotification from './email-notification'

interface Props {
  handleSourceFileUnlockSuccess: Function
  sourceFile: ISourceFile
}

interface States {
  completionPercentage: number
  queuePosition: number
}

class UnlockSourceLink extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)

    this.state = {
      completionPercentage: 0,
      queuePosition: 0,
    }

    this.monitorQueuedFiles = this.monitorQueuedFiles.bind(this)

    this.monitorQueuedFiles()
  }

  private monitorQueuedFiles() {
    const setQueuedFiles = () => {
      return new Promise(async (resolve) => {
        const res         = await countSourceFiles('pending')
        const queuedFiles = res.data.totalQueuedFiles

        this.setState({ queuePosition: queuedFiles })

        resolve(queuedFiles)
      })
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
