type sourceFileStatus = 'init' | 'verified' | 'pending' | 'running' | 'failed' | 'completed'

export default interface ISourceFile {
  id?: number
  downloadLink?: string
  status?: sourceFileStatus
  createdAt?: string
  updatedAt?: string
  name: string
  sourceLink: string
  size: number
  type: string
}
