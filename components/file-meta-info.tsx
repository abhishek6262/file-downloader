import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImage,
  faQuestion,
  faThumbsUp,
  faTimesCircle,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { queueSourceFile } from '../utils/api';
import ISourceFile from '../utils/Source/interface/ISourceFile'

interface Props {
  handleSourceFileUnlockCancelled: Function
  handleSourceFileUnlockQueued: Function
  sourceFile: ISourceFile
}

class FileMetaInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props)

    this.queueSourceFileToUnlock = this.queueSourceFileToUnlock.bind(this) 
  }

  private async queueSourceFileToUnlock() {
    try {
      const res = await queueSourceFile(this.props.sourceFile.sourceLink)

      this.props.handleSourceFileUnlockQueued(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { handleSourceFileUnlockCancelled, sourceFile } = this.props
    const fileType = sourceFile.type.split('/')[0].toLowerCase()

    let fileIcon: JSX.Element
  
    if (fileType === 'image') {
      fileIcon = <FontAwesomeIcon icon={faImage} />
    } else if (fileType === 'video') {
      fileIcon = <FontAwesomeIcon icon={faVideo} />
    } else {
      fileIcon = <FontAwesomeIcon icon={faQuestion} />
    }
  
    return (
      <div className="bg-white shadow-md rounded mx-auto px-8 py-6 w-full">
        <div className="lg:flex">
          <div className="max-w-md">
            <div className="md:inline-block align-middle mb-3 lg:mb-1 mr-6">
              <div className="flex items-center justify-center h-16 w-16 bg-orange-300 p-5 rounded-full">
                {fileIcon}
              </div>
            </div>
  
            <div className="md:inline-block align-middle max-w-xs mb-3 lg:mb-1">
              <p className="font-semibold">{sourceFile.name}</p>
              <p className="truncate max-w-xs text-gray-600 mb-2">{sourceFile.sourceLink}</p>
  
              <div>
                <p className="inline-block mr-2"><span className="text-gray-600">File size:</span> <span className="font-semibold">{(sourceFile.size / 1000).toFixed(2)} MB</span></p>
                <p className="inline-block"><span className="text-gray-600">File type:</span> <span className="font-semibold">{sourceFile.type}</span></p>
              </div>
            </div>
          </div>
  
          <div className="flex items-center ml-auto">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold mr-3 py-3 px-4 rounded inline-flex justify-center items-center w-full" onClick={() => handleSourceFileUnlockCancelled()}>
              <FontAwesomeIcon icon={faTimesCircle} />
              <span className="ml-2">Cancel</span>
            </button>
  
            <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 font-bold py-3 px-4 rounded inline-flex justify-center items-center w-full" onClick={this.queueSourceFileToUnlock}>
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="ml-2">Continue</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default FileMetaInfo
