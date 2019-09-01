import mongoose, { Schema } from 'mongoose'
import Connection from '../Connection'

abstract class Model {
  static collection: string
  static schema: Schema

  static instance(options = {}): Promise<mongoose.Document> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!Connection.isConnected()) {
          await Connection.create()
        }
      } catch (err) {
        reject(err)

        return
      }

      const instance = mongoose.model(this.collection, this.schema)

      resolve(new instance(options))
    })
  }
}

export default Model
