type sourceFileStatus = 'init' | 'verified' | 'pending' | 'running' | 'failed' | 'completed'

export default interface ISourceFile {
  _id?: number
  email?: string
  failedAttempts?: number
  downloadLink?: string
  status?: sourceFileStatus
  createdAt?: string
  updatedAt?: string
  name: string
  sourceLink: string
  size: number
  type: string
}
