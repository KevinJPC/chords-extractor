import path from 'node:path'
import { randomUUID } from 'node:crypto'
import initializeYoutubeMp3Converter from 'youtube-mp3-converter'
import fs from 'node:fs/promises'
import { spawnPython } from '../utils/spawnPython.js'
import AudioAnalysis from '../models/AudioAnalysis.js'

const PYTHON_CMD = path.join(process.cwd(), '..', 'audio-analysis-py', '.venv', 'scripts', 'python')
const TEMP_AUDIO_FILES_PATH = 'temp'
const PYTHON_SCRIPT = path.join(process.cwd(), '..', 'audio-analysis-py', 'src', 'main.py')

export const analyzeAudioProcessor = async (job) => {
  let audioPath
  try {
    const { youtubeId, title, duration, thumbnails } = job.data
    audioPath = await convertToMp3({ youtubeId })
    const { bpm, chordsPerBeats, beats } = await analyzeAudioWithPython({ audioPath })
    const audioAnalysis = await AudioAnalysis.create({
      youtubeId,
      title,
      bpm,
      chordsPerBeats,
      beats,
      thumbnails,
      duration
    })
    return Promise.resolve(audioAnalysis)
  } finally {
    if (audioPath !== undefined) {
      await fs.unlink(audioPath)
    }
  }
}

const analyzeAudioWithPython = async ({ audioPath }) => {
  const { bpm, beats, chords_per_beats: chordsPerBeats } = await spawnPython({ pythonCmd: PYTHON_CMD, filePath: PYTHON_SCRIPT, args: [audioPath] })
  const beatsMapped = beats.map(({ start_time: startTime, end_time: endTime }) => ({ startTime, endTime }))
  return { bpm, beats: beatsMapped, chordsPerBeats }
}

const youtubeMp3Converter = initializeYoutubeMp3Converter(TEMP_AUDIO_FILES_PATH)

const convertToMp3 = async ({ youtubeId }) => {
  try {
    const audioPath = await youtubeMp3Converter(youtubeId, {
      title: randomUUID()
    })
    return audioPath
  } catch (error) {
    console.error(error)
  }
}