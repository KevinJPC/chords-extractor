import { spawn } from 'child_process'
import { cwd } from 'node:process'
import path from 'node:path'
import { EventEmitter } from 'node:events'

import { randomUUID } from 'node:crypto'
import youtubeMp3Converter from 'youtube-mp3-converter'

const CWD = cwd()

const PYTHON_CMD = path.join(CWD, 'python', '.venv', 'scripts', 'python')
const PYTHON_FILE_PATH = path.join(CWD, 'python', 'src', 'main.py')

const TEMP_AUDIO_FILES_PATH = 'temp'
const convertLinkToMp3 = youtubeMp3Converter(TEMP_AUDIO_FILES_PATH)

export const eventEmitter = new EventEmitter()

export const ytSongsInAnalysis = new Set()

export const convertToMp3 = async ({ id }) => {
  try {
    const audioPath = await convertLinkToMp3(id, {
      // title: 'test'
      title: randomUUID()
    })
    return audioPath
  } catch (error) {
    console.error(error)
  }
}

export const analyzeAudio = ({ audioPath }) => {
  const spawnProcess = spawn(`${PYTHON_CMD}`, [PYTHON_FILE_PATH, audioPath])
  let response = ''

  const promise = new Promise((resolve, reject) => {
    spawnProcess.stdout.on('data', (data) => {
      response += data.toString()
    })

    spawnProcess.stdout.on('end', () => {
      try {
        const { status, data, message } = JSON.parse(response)
        if (status === 'fail') reject(message)

        const { chords, bpm, beat_times: beatTimes } = data
        resolve({ chords, bpm, beatTimes })
      } catch (e) {
        console.error('error', e)
        reject(e)
      }
    })

    spawnProcess.stderr.on('data', (data) => {
      console.error('stderr', data.toString())
    })

    spawnProcess.on('error', (err) => {
      console.error('spawn process error', err)
      reject(err)
    })
  })

  return promise
}

export const processAudio = async ({ id }) => {
  try {
    const eventEmitterPromise = new Promise((resolve, reject) => {
      eventEmitter.on(`end:${id}`, (data) => resolve(data))
    })

    const songIsInAnalysis = ytSongsInAnalysis.has(id)

    if (!songIsInAnalysis) {
      ytSongsInAnalysis.add(id)
      const audioPath = await convertToMp3({ id })
      const { chords, bpm, beatTimes } = await analyzeAudio({ audioPath })
      ytSongsInAnalysis.delete(id)
      eventEmitter.emit(`end:${id}`, { chords, bpm, beatTimes })
    }

    return eventEmitterPromise
  } catch (error) {
    console.error(error)
  }
}
class AudioService {
  #eventEmitter
  #ytSongsInAnalysis
  constructor () {
    this.#eventEmitter = new EventEmitter()
    this.#ytSongsInAnalysis = new Set()
  }

  async processAudio () {

  }
}
