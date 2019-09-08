import mongoose, { Model, model } from 'mongoose'
import { IFileDocument } from './Document'
import { FileSchema } from './Schema'

delete mongoose.connection.models['files']

export interface IFileDocument extends IFileDocument { }
export interface IFileModel extends Model<IFileDocument> { }

const FileModel: IFileModel = model<IFileDocument, IFileModel>('files', FileSchema)

export default FileModel
