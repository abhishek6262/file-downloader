type sourceFileStatus = 'init' | 'verified' | 'pending' | 'running' | 'failed' | 'completed'

export default interface ISourceFile {
  id?: number
  downloadLink?: string
  status?: sourceFileStatus
  created_at?: string
  updated_at?: string
  name: string
  sourceLink: string
  size: number
  type: string
}
