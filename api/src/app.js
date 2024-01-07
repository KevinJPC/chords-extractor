import { connectToDb } from './db/conn.js'
import express from 'express'
import morgan from 'morgan'
import audio from './routes/audioAnalyses.js'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js'

await connectToDb()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(morgan('dev'))

app.use('/audio-analyses', audio)

app.get('/test', (req, res) => {
  res.send(`test ${Math.random()}`)
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})
