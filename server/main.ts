import Connection from './Database/Connection'
import express from 'express'
import next from 'next'
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
