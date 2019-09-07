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

  static async create(): Promise<typeof mongoose> {
    if (this.isConnected()) {
      return this.connection
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

      return this.connection
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static isConnected(): boolean {
    return this.connection !== undefined 
  }
}

export default Connection
