import path from 'node:path'
import { EventEmitter } from 'node:events'
import { randomUUID } from 'node:crypto'
import initializeYoutubeMp3Converter from 'youtube-mp3-converter'
import fs from 'node:fs/promises'
import { spawnPython } from '../utils/spawnPython.js'
import AudioAnalysis from '../models/AudioAnalysis.js'

const TEMP_AUDIO_FILES_PATH = 'temp'

const youtubeAudiosCompletionEmitter = new EventEmitter()

const youtubeAudiosInAnalysis = new Set()

export const analyzeAudio = async ({ youtubeId }) => {
  try {
    const onEndPromise = new Promise((resolve, reject) => {
      youtubeAudiosCompletionEmitter.once(youtubeId, ({ error, data: audioAnalysis }) => {
        if (error) return reject(error)
        resolve(audioAnalysis)
      })
    })
    const songIsInAnalysis = youtubeAudiosInAnalysis.has(youtubeId)

    if (!songIsInAnalysis) runAudioAnalysisProcess({ youtubeId })

    return onEndPromise
  } catch (error) {
    console.error(error)
    return error
  }
}

const runAudioAnalysisProcess = async ({ youtubeId }) => {
  let audioPath
  try {
    youtubeAudiosInAnalysis.add(youtubeId)
    audioPath = await convertToMp3({ youtubeId })
    const { chords, bpm, beatTimes } = await analyzeAudioWithPython({ audioPath })
    const audioAnalysis = await AudioAnalysis.create({ youtubeId, chords, bpm, beatTimes })
    youtubeAudiosCompletionEmitter.emit(youtubeId, { error: null, data: audioAnalysis })
  } catch (error) {
    youtubeAudiosCompletionEmitter.emit(youtubeId, { error })
  } finally {
    youtubeAudiosInAnalysis.delete(youtubeId)
    if (audioPath) fs.unlink(audioPath)
  }
}

const analyzeAudioWithPython = async ({ audioPath }) => {
  try {
    const PYTHON_FILE_PATH = path.join('python', 'src', 'main.py')
    const { chords, bpm, beat_times: beatTimes } = await spawnPython({ pythonFilePath: PYTHON_FILE_PATH, args: [audioPath] })
    return { chords, bpm, beatTimes }
  } catch (error) {
    return error
  }
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
