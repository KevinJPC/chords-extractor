import { connectToDb } from './db/conn.js'
import express from 'express'
import morgan from 'morgan'
import audio from './routes/audioAnalyses.js'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js'

async function main () {
  await connectToDb()

  const app = express()
  const port = process.env.PORT || 3000

  app.use(cors())
  app.use(express.json())

  morgan.token('body', (req) => JSON.stringify(req.body))
  app.use(morgan(':method :url :body'))

  app.use('/api/audio-analyses', audio)

  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
  })
}

main()
