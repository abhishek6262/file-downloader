import { Schema } from 'mongoose'

const fileSchema = new Schema({
  name: String,
  size: Number,
  status: String,
  type: String,
  downloadLink: String,
  sourceLink: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

export default fileSchema
