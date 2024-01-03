import { spawn } from 'node:child_process'
import path from 'node:path'

const PYTHON_CMD = path.join('python', '.venv', 'scripts', 'python')

export const spawnPython = ({ pythonFilePath, args = [] }) => {
  const spawnProcess = spawn(`${PYTHON_CMD}`, [pythonFilePath, ...args])
  let response = ''

  const promise = new Promise((resolve, reject) => {
    spawnProcess.stdout.on('data', (data) => {
      response += data.toString()
    })

    spawnProcess.stdout.on('end', () => {
      try {
        const { status, data, message } = JSON.parse(response)
        if (status === 'fail') reject(message)

        resolve(data)
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
