import React, { FunctionComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp,
  faTimesCircle,
  faVideo
} from '@fortawesome/free-solid-svg-icons'
import ISourceFile from '../pages/api/interface/ISourceFile'

interface Props {
  handleCancelSourceFileLink: Function
  handleContinueWithSourceFileLink: Function
  sourceFile: ISourceFile
}

const FileMetaInfo: FunctionComponent<Props> = ({ handleCancelSourceFileLink, handleContinueWithSourceFileLink, sourceFile }) => (
  <div className="bg-white shadow-md rounded mx-auto px-8 py-6 w-full">
    <div className="lg:flex">
      <div className="max-w-md">
        <div className="md:inline-block align-middle mb-3 lg:mb-1 mr-6">
          <div className="flex items-center justify-center h-16 w-16 bg-orange-300 p-5 rounded-full">
            <FontAwesomeIcon icon={faVideo} />
          </div>
        </div>

        <div className="md:inline-block align-middle mb-3 lg:mb-1">
          <p className="font-semibold">{sourceFile.name}</p>
          <p className="truncate max-w-xs text-gray-600 mb-2">{sourceFile.sourceLink}</p>

          <div>
            <p className="inline-block mr-2"><span className="text-gray-600">File size:</span> <span className="font-semibold">{(sourceFile.size / 1000).toFixed(2)} MB</span></p>
            <p className="inline-block"><span className="text-gray-600">File type:</span> <span className="font-semibold">{sourceFile.type}</span></p>
          </div>
        </div>
      </div>

      <div className="flex items-center ml-auto">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold mr-3 py-3 px-4 rounded inline-flex justify-center items-center w-full" onClick={() => handleCancelSourceFileLink()}>
          <FontAwesomeIcon icon={faTimesCircle} />
          <span className="ml-2">Cancel</span>
        </button>

        <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 font-bold py-3 px-4 rounded inline-flex justify-center items-center w-full" onClick={() => handleContinueWithSourceFileLink()}>
          <FontAwesomeIcon icon={faThumbsUp} />
          <span className="ml-2">Continue</span>
        </button>
      </div>
    </div>
  </div>
)

export default FileMetaInfo
