import { spawn } from 'child_process'
import {cwd} from 'node:process'
import path from 'path';

const currentDirectory = cwd()

const PYTHON_CMD = path.join(currentDirectory, 'python', '.venv', 'scripts', 'python')
const PYTHON_FILE_PATH = path.join(currentDirectory, 'python', 'src', 'main.py')


function analyzeAudio({ audioPath }) {

  const spawnProcess = spawn(`${PYTHON_CMD}`, [PYTHON_FILE_PATH, audioPath])
  let response = ''
  
  const promise = new Promise((resolve, reject) => {
    spawnProcess.stdout.on('data', (data) => {
      response += data.toString()
    })

    spawnProcess.stdout.on('end', () => {
      try {
        console.log(response)
        const { status, data } = JSON.parse(response)
        if(status === 'fail') reject()

        resolve(data)
      } catch (e) {
        console.error('error', e)
        reject()
      }
    })
    
    spawnProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    })
     
    spawnProcess.on('error', (err) => {
      console.error(err);
      reject()
    })
  })

  return promise
}


try {
  const audioInfo = await analyzeAudio({audioPath: "C:/Users/kepc0/Downloads/y2mate.com - Barak  Acepta Video Oficial.mp3"})
  console.log(audioInfo);
} catch (error) {
  console.log(error)
}
