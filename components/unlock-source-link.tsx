import React from 'react'
import ISourceFile from '../util/Source/interface/ISourceFile'
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
      queuePosition: 2,
    }

    this.mimicServerLinkUnlocking = this.mimicServerLinkUnlocking.bind(this)

    this.mimicServerLinkUnlocking()
  }

  private mimicServerLinkUnlocking() {
    const incrementCompletionPercentage = () => {
      const newCompletionPercentage = this.state.completionPercentage + 1

      this.setState({ completionPercentage: newCompletionPercentage })

      return newCompletionPercentage
    }

    const decrementQueue = () => {
      const newQueuePosition = this.state.queuePosition - 1

      this.setState({ queuePosition: newQueuePosition })

      return newQueuePosition
    }

    const queuePositionInterval = setInterval(() => {
      const queuePosition = decrementQueue()

      if (queuePosition === 0) {
        clearInterval(queuePositionInterval)

        const incrementCompletionPercentageInterval = setInterval(() => {
          const newCompletionPercentage = incrementCompletionPercentage()

          if (newCompletionPercentage === 100) {
            const newSourceLink = 'https://resu.me/s6516s1dc'
            this.props.handleSourceFileUnlockSuccess(newSourceLink)

            clearInterval(incrementCompletionPercentageInterval)
          }
        }, 100)
      }
    }, 2000)
  }

  render() {
    let content: JSX.Element
    const { completionPercentage, queuePosition } = this.state

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
