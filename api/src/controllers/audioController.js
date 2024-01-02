import { processAudio } from '../services/audioService.js'
import { sseHeaders, buildSSEResponse } from '../utils/sse.js'

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

export const analyzeAudio = async (req, res) => {
  try {
    res.writeHead(200, sseHeaders)

    const { id } = req.body

    const { chords, bpm, beatTimes } = await processAudio({ id })

    const response = buildSSEResponse({
      status: 'sucess',
      data: { chords, bpm, beatTimes }
    })
    res.write(response)

    res.end()
  } catch (error) {
    console.log(error)
  }
}
