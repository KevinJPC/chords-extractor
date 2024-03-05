import path from 'node:path'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { spawn } from 'node:child_process'
import readLine from 'node:readline'
import { formatChordSymbols } from '../../../chords-utils/index.js'

const PYTHON_CMD = path.join(process.cwd(), '..', 'audio-analysis-py', '.venv', 'scripts', 'python')
const PYTHON_SCRIPT = path.join(process.cwd(), '..', 'audio-analysis-py', 'src', 'main.py')

export const analyzeAudioProcessor = async (job) => {
  await job.updateProgress({ started: true })

  const { youtubeId, title, duration, thumbnails } = job.data

  const { bpm, beats, chordsPerBeats } = await analyzeAudioWithPython({ youtubeId })

  const chordsPerBeatsFormatted = formatChordSymbols(chordsPerBeats)

  console.log('chordsPerBeats: ', chordsPerBeats)
  console.log('chordsPerBeatsFormatted: ', chordsPerBeatsFormatted)

  const audioAnalysis = await AudioAnalysis.create({
    youtubeId,
    title,
    bpm,
    chordsPerBeats: chordsPerBeatsFormatted,
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

        if (response.status === RESPONSE_STATUS.SUCCESS) {
          const { bpm, beats, chords_per_beats: chordsPerBeats } = response.data
          const beatsMapped = beats.map(({ start_time: startTime, end_time: endTime }) => ({ startTime, endTime }))
          return resolve({ bpm, beats: beatsMapped, chordsPerBeats })
        }
        return reject(response?.message || 'Error analyzing audio')
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
        console.error('error analyzing audio error: ', error)
        reject(new Error('Error analyzing audio'))
      }
    })
  })
}
