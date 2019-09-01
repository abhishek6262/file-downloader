import { Schema } from 'mongoose'

const fileSchema = new Schema({
  name: String,
  size: Number,
  status: { type: String, default: 'pending' },
  type: String,
  downloadLink: { type: String, default: '' },
  sourceLink: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default fileSchema
