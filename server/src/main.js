import { spawn } from 'child_process'
import { cwd } from 'node:process'
import path from 'path'
import youtubeMp3Converter from 'youtube-mp3-converter'
import { randomUUID } from 'node:crypto'

const CWD = cwd()
const TEMP_AUDIO_FILES_PATH = 'temp'

const PYTHON_CMD = path.join(CWD, 'python', '.venv', 'scripts', 'python')
const PYTHON_FILE_PATH = path.join(CWD, 'python', 'src', 'main.py')

const convertLinkToMp3 = youtubeMp3Converter(TEMP_AUDIO_FILES_PATH)

function analyzeAudio ({ audioPath }) {
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

async function main () {
  try {
    const audioPath = await convertLinkToMp3('https://www.youtube.com/watch?v=IxD3JiOo9DY', {
      title: randomUUID()
    })
    const audioInfo = await analyzeAudio({ audioPath })
    console.log(audioInfo)
  } catch (error) {
    console.log(error)
  }
}

main()
