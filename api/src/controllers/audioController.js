import { analyzeAudio } from '../services/audioService.js'
import { sseHeaders, buildSSEResponse } from '../utils/sse.js'

export const getAudioInfo = async (req, res) => {
//
}

export const createAudioAnalysis = async (req, res) => {
  try {
    res.writeHead(200, sseHeaders)

    const { youtubeId } = req.body

    const { chords, bpm, beatTimes } = await analyzeAudio({ youtubeId })

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
