import { spawn } from 'node:child_process'
import readLine from 'node:readline'

const DATA_EVENTS = {
  PROGRESS: 'progress',
  ERROR: 'error',
  RESULT: 'result'
}

export const spawnPython = ({ venvPythonScript, filePath, args = [] }) => {
  const spawnProcess = spawn(`${venvPythonScript}`, [filePath, ...args])

  const lineReader = readLine.createInterface({ input: spawnProcess.stdout })

  const promise = new Promise((resolve, reject) => {
    lineReader.on('line', (line) => {
      try {
        const { event, data } = JSON.parse(line)

        if (event === DATA_EVENTS.PROGRESS) {
          //
        }

        if (event === DATA_EVENTS.ERROR) {
          reject(Error(data.message))
        }

        if (event === DATA_EVENTS.RESULT) {
          resolve(data)
        }
      } catch (error) {
        reject(error)
      }
    })

    spawnProcess.on('close', (code) => {
      if (code === 1) {
        reject(Error('An error occurred during audio analysis'))
      }
    })
  })

  return promise
}
