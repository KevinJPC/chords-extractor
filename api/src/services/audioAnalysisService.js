import path from 'node:path'
import { EventEmitter } from 'node:events'
import { randomUUID } from 'node:crypto'
import initializeYoutubeMp3Converter from 'youtube-mp3-converter'
import fs from 'node:fs/promises'
import { spawnPython } from '../utils/spawnPython.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { YoutubeVideoDetails } from './youtubeService.js'

const VENV_PYTHON_SCRIPT = path.join(process.cwd(), '..', 'audio-analysis-py', '.venv', 'scripts', 'python')

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
    const videoDetails = await YoutubeVideoDetails.search({ id: youtubeId })
    audioPath = await convertToMp3({ youtubeId })
    const audioAnalysisResult = await analyzeAudioWithPython({ audioPath })
    const audioAnalysis = await AudioAnalysis.create({
      youtubeId,
      title: videoDetails.title,
      bpm: audioAnalysisResult.bpm,
      chordsPerBeats: audioAnalysisResult.chordsPerBeats,
      beats: audioAnalysisResult.beats,
      thumbnails: videoDetails.thumbnails,
      duration: videoDetails.duration
    })
    youtubeAudiosCompletionEmitter.emit(youtubeId, { error: null, data: audioAnalysis })
  } catch (error) {
    youtubeAudiosCompletionEmitter.emit(youtubeId, { error })
  } finally {
    youtubeAudiosInAnalysis.delete(youtubeId)
    if (audioPath) fs.unlink(audioPath)
  }
}

const analyzeAudioWithPython = async ({ audioPath }) => {
  const filePath = path.join(process.cwd(), '..', 'audio-analysis-py', 'src', 'main.py')
  const { bpm, beats, chords_per_beats: chordsPerBeats } = await spawnPython({ venvPythonScript: VENV_PYTHON_SCRIPT, filePath, args: [audioPath] })
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
