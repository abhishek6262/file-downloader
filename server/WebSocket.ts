import { Server } from 'http'
import IO, { Socket } from 'socket.io'

class WebSocket {
  private static socket: Socket = undefined

  private constructor() { }

  public static broadcast(channel: string, data: any) {
    const socket = this.getSocket()

    socket.emit(channel, data)
  }

  private static getSocket(): Socket {
    if (this.socket === undefined) {
      throw new Error('Please prepare the web socket server.')
    }

    return this.socket
  }

  public static prepare(server: Server) {
    const io = IO(server)

    io.on('connection', socket => this.socket = socket)
  }
}

export default WebSocket
