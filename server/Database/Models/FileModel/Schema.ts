import { Schema } from 'mongoose'
import getConfig from 'next/config'
import Path from 'path'

const FileSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  size: { type: Number, required: true },
  failedAttempts: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  type: { type: String, required: true },
  filePath: { type: String, default: '' },
  sourceLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

FileSchema.virtual('downloadLink').get(function () {
  if (this.filePath.length < 1) {
    return ''
  }

  const { publicRuntimeConfig: { APP_URL } } = getConfig()

  let fileName = Path.basename(this.filePath)

  return APP_URL + '/d?file=' + fileName
})

FileSchema.set('toJSON', { virtuals: true })
FileSchema.set('toObject', { virtuals: true })

export { FileSchema }
