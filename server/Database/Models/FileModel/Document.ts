import { Document } from 'mongoose';

export interface IFileDocument extends Document {
  name: string
  size: number
  failedAttempts: number
  status: string
  type: string
  downloadLink: string
  sourceLink: string
  createdAt: Date
  updatedAt: Date
}
