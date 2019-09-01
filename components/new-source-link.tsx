import React from 'react'
import ISourceFile from '../utils/Source/interface/ISourceFile'

interface Props {
  sourceFile: ISourceFile
}

class NewSourceLink extends React.Component<Props> {
  render() {
    const downloadLink = this.props.sourceFile.downloadLink

    return (
      <div className="text-center">
        <h3 className="font-semibold text-xl mb-1">Thanks for using our service.</h3>
        <p className="text-gray-700 mb-5">Given below is your new download link. Click on it to start downloading.</p>

        <div className="max-w-md bg-gray-200 mb-5 p-2 rounded-lg mx-auto whitespace-no-wrap overflow-x-auto">
          <a target="_blank" href={downloadLink}>{downloadLink}</a>
        </div>

        <p className="font-semibold">If You Like What We Do. Please Spread The Words With Your Audience.</p>
      </div>
    )
  }
}

export default NewSourceLink
