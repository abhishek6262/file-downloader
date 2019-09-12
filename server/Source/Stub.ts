import ISourceFile from './interface/ISourceFile'

const SOURCE_FILE_STUB: ISourceFile = {
  _id: -1,
  name: '',
  email: '',
  downloadLink: '',
  sourceLink: '',
  size: 0,
  failedAttempts: 0,
  status: 'init',
  type: '',
  createdAt: '',
  updatedAt: '',
}

export default SOURCE_FILE_STUB 
