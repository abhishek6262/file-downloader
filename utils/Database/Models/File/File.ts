import { Schema } from 'mongoose';
import Model from '../Model'
import FileSchema from './Schema'

class File extends Model {
  static collection: string = 'files'
  static schema: Schema = FileSchema
}

export default File
