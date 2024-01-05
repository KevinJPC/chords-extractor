import { analyzeAudio } from '../services/audioAnalysisService.js'
import { youtubeSearch } from '../services/youtubeSearchService.js'
import { sseHeaders, buildSSEResponse } from '../utils/sse.js'

const SOURCES = {
  YOUTUBE: 'youtube'
}

export const getAllAudioAnalyses = async (req, res) => {
  try {
    const { source, query } = req.query
    const { nextPage } = req.body

    const result = await youtubeSearch({ query, nextPage })

    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    console.error(error)
  }
}

export const getAudioAnalysis = async (req, res) => {
  try {
    const { youtubeId } = req.params
    res.status(200).json({
      status: 'success',
      data: youtubeId

    })
  } catch (error) {
    console.error(error)
  }
}

export const createAudioAnalysis = async (req, res) => {
  try {
    res.writeHead(200, sseHeaders)

    const { youtubeId } = req.body

    const { chords, bpm, beatTimes } = await analyzeAudio({ youtubeId })

    const response = buildSSEResponse({
      status: 'success',
      data: { chords, bpm, beatTimes }
    })
    res.write(response)

    res.end()
  } catch (error) {
    console.log(error)
  }
}
