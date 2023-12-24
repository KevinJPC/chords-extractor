import { spawn } from 'child_process'
import {cwd} from 'node:process'
import path from 'path';

const currentDirectory = cwd()

const pythonCmd = path.join('python', '.venv', 'Scripts', 'python.exe')
const pythonFilePath = path.join('python', 'main.py')

//                           ignores warnings on output
const p = spawn(pythonCmd, ['-W ignore', pythonFilePath])

p.stdout.on('data', async (data) => {
  const audioInfo = JSON.parse(data.toString())
  console.log('Audio info:', audioInfo);
})

p.on('exit', (...args) => {
})


p.on('error', (...args) => {
})