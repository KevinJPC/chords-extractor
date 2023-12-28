import express from 'express'
import morgan from 'morgan'
import audio from './routes/audio.js'

const app = express()
const port = 3000

app.use(morgan('dev'))

app.use('/audio', audio)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
