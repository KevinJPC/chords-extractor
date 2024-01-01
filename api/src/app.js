import express from 'express'
import morgan from 'morgan'
import audio from './routes/audio.js'
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.use(morgan('dev'))

app.use('/audio', audio)

app.get('/test', (req, res) => {
  res.send(`test ${Math.random()}`)
})

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})
