import { spawn } from 'child_process'
import {cwd} from 'node:process'
import path from 'path';

const currentDirectory = cwd()

const pythonCmd = path.join(currentDirectory, 'python', '.venv', 'scripts', 'python')
const pythonFilePath = path.join(currentDirectory, 'python', 'src', 'main.py')

const pythonChildProcess = spawn(`${pythonCmd}`, [pythonFilePath])

pythonChildProcess.stdout.on('data', async (data) => {
  const audioInfo = JSON.parse(data.toString())
  console.log('Audio info:', audioInfo);
})

pythonChildProcess.on('exit', (...args) => {
  console.log(args);
})


pythonChildProcess.on('error', (...args) => {
  console.log(args);
})