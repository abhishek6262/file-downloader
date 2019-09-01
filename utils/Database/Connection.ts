import getConfig from 'next/config'
import mongoose from 'mongoose'

class Connection {
  private static connection: typeof mongoose = undefined

  private constructor() { }

  private static config() {
    const { serverRuntimeConfig } = getConfig()

    const MONGO_DB_NAME = serverRuntimeConfig.MONGO_DB_NAME
    const MONGO_DSN     = serverRuntimeConfig.MONGO_DSN

    const config = {
      MONGO_DB_NAME,
      MONGO_DSN,
    }

    return config
  }

  static create(): Promise<typeof mongoose> {
    return new Promise(async (resolve, reject) => {
      if (this.isConnected()) {
        resolve(this.connection)
        return
      }

      const { MONGO_DB_NAME, MONGO_DSN } = this.config()

      try {
        this.connection = await mongoose.connect(
          MONGO_DSN,
          {
            useNewUrlParser: true,
            dbName: MONGO_DB_NAME
          }
        )

        resolve(this.connection)
      } catch (err) {
        reject(err.message)
      }
    })
  }

  static isConnected(): boolean {
    return this.connection !== undefined 
  }
}

export default Connection
