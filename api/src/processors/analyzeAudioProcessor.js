import path from 'node:path'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { spawn } from 'node:child_process'
import readLine from 'node:readline'

const PYTHON_CMD = path.join(process.cwd(), '..', 'audio-analysis-py', '.venv', 'scripts', 'python')
const PYTHON_SCRIPT = path.join(process.cwd(), '..', 'audio-analysis-py', 'src', 'main.py')

export const analyzeAudioProcessor = async (job) => {
  const { youtubeId, title, duration, thumbnails } = job.data

  const { bpm, beats, chordsPerBeats } = await analyzeAudioWithPython({ youtubeId })

  const audioAnalysis = await AudioAnalysis.create({
    youtubeId,
    title,
    bpm,
    chordsPerBeats,
    beats,
    thumbnails,
    duration
  })

  return audioAnalysis
}

const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
}

const analyzeAudioWithPython = async ({
  youtubeId
}) => {
  const pythonProcess = spawn(`${PYTHON_CMD}`, [PYTHON_SCRIPT, youtubeId])

  const stdoutLineReader = readLine.createInterface({ input: pythonProcess.stdout })

  return new Promise((resolve, reject) => {
    let error = ''

    stdoutLineReader.on('line', (line) => {
      try {
        const response = JSON.parse(line)

        console.log('analyzing: ', response.status)
        if (response.status === RESPONSE_STATUS.ERROR) return reject(response?.message)
        if (response.status === RESPONSE_STATUS.SUCCESS) {
          const { bpm, beats, chords_per_beats: chordsPerBeats } = response.data
          const beatsMapped = beats.map(({ start_time: startTime, end_time: endTime }) => ({ startTime, endTime }))
          return resolve({ bpm, beats: beatsMapped, chordsPerBeats })
        }
      } catch (error) {
        reject(error)
      }
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        console.log('error', code)
        reject(new Error(error))
      }
    })
  })
}
