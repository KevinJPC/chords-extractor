import { convertToMp3, analyzeAudio as analyzeAudioService, ytSongsInAnalysis, processAudio, eventEmitter } from '../services/audioService.js'

const SseHeaders = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache'
}

export const getAudioInfo = async (req, res) => {
  // try {
  //   const { id } = req.params
  //   const audioPath = await convertToMp3({ id })
  //   const { chords, bpm, beatTimes } = await analyzeAudio({ audioPath })

  //   res.status(200).json({
  //     status: 'sucess',
  //     data: { chords, bpm, beatTimes }
  //   })
  // } catch (error) {
  //   console.log(error)
  // }
}

function formatSSEResponse ({ data }) {
  return `data: ${JSON.stringify(data)}\n\n`
}

export const analyzeAudio = async (req, res) => {
  //
  try {
    console.log('hit')

    req.writeHead(200, SseHeaders)

    const { id } = req.body
    console.log('id', id)

    res.write(formatSSEResponse({
      data: {
        status: 'sucess',
        data: 'starting'
      }
    }))

    const audioIsInAnalysis = ytSongsInAnalysis.has(id)

    if (!audioIsInAnalysis) {
      ytSongsInAnalysis.add(id)
      processAudio({ id })
    }

    eventEmitter.on(`finish-${id}`, (data) => {
      res.write(formatSSEResponse({
        data: {
          status: 'sucess',
          data
        }
      }))
      res.end()
    })
  } catch (error) {
    console.log(error)
  }
}
