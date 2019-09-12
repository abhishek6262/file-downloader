import Connection from './Database/Connection'
import express from 'express'
import Fs from 'fs'
import next from 'next'
import Path from 'path'
import FileModel from './Database/Models/FileModel'
import Scheduler from './Scheduler/Scheduler'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  // Make a Database connection.
  await Connection.create()

  // Handle app routes.
  const server = express()

  server.get('/d', async (req, res) => {
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

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err

    console.log(`> Ready on http://localhost:${port}`)
  })

  // Run the Cron Jobs scheduled.
  Scheduler.run()
})
