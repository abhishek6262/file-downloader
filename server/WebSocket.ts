import getConfig from 'next/config'
import Pusher from 'pusher'

class WebSocket {
  private static connection: Pusher = undefined
  private static eventName: string = ''

  private constructor() { }

  public static broadcast(channel: string, data: any) {
    const { connection, eventName } = this.getConnection()

    connection.trigger(channel, eventName, data)
  }

  private static config() {
    const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

    const config = {
      cluster: publicRuntimeConfig.PUSHER_CLUSTER,
      eventName: publicRuntimeConfig.PUSHER_EVENT_NAME,
      key: publicRuntimeConfig.PUSHER_KEY,
      appId: serverRuntimeConfig.PUSHER_APP_ID,
      secret: serverRuntimeConfig.PUSHER_SECRET,
    }

    return config
  }

  private static getConnection(): { connection: Pusher, eventName: string } {
    if (this.connection === undefined || this.eventName.length < 1) {
      const config = this.config()

      this.eventName = config.eventName
      this.connection = new Pusher(config)
    }

    return { connection: this.connection, eventName: this.eventName }
  }
}

export default WebSocket
