import { Schema } from 'mongoose'

const FileSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  size: { type: Number, required: true },
  failedAttempts: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  type: { type: String, required: true },
  downloadLink: { type: String, default: '' },
  sourceLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export { FileSchema }
