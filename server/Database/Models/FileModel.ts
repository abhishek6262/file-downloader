import mongoose, { Schema } from 'mongoose'

delete mongoose.connection.models['files']

const fileSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  type: { type: String, required: true },
  downloadLink: { type: String, default: '' },
  sourceLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model('files', fileSchema)
