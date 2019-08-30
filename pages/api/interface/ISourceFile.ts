type sourceFileStatus = 'init' | 'verified' | 'pending' | 'running' | 'failed' | 'completed'

export default interface ISourceFile {
  id: number
  name: string
  downloadLink: string
  sourceLink: string
  size: number
  status: sourceFileStatus
  type: string
  created_at: string
  updated_at: string
}
