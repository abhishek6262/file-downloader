import Connection from './Database/Connection'
import express from 'express'
import Http from 'http'
import Fs from 'fs'
import next from 'next'
import Path from 'path'
import FileModel from './Database/Models/FileModel'
import Scheduler from './Scheduler/Scheduler'
import WebSocket from './WebSocket'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextHandler = next({ dev })
const handle = nextHandler.getRequestHandler()

// Handle app routes.
const app = express()
const server = Http.createServer(app)

// Make web socket available to the app.
WebSocket.prepare(server)

nextHandler.prepare().then(async () => {
  // Make a Database connection.
  await Connection.create()

  // Run the Cron Jobs scheduled.
  Scheduler.run()

  app.get('/d', async (req, res) => {
    try {
      const file = await FileModel.findById(req.query.file)

      if (!file || file.filePath.length < 1) {
        res.status(404).json({ message: 'This download link is invalid.' })
        return
      }

      const filePath = Path.resolve(file.filePath)

      if (!Fs.existsSync(filePath)) {
        res.status(404).json({ message: 'This download link is invalid.' })
        return
      }

      const fileName = Path.basename(file.filePath)

      res.download(filePath, fileName)
    } catch (err) {
      res.status(500).json({ message: 'This download link is invalid.' })
      return
    }
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => console.log(`> Ready on http://localhost:${port}`))
})
