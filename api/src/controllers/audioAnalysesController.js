import { NextPage } from 'youtube-search-api'
import { AUDIO_ALREADY_ANALYZED, AUDIO_ANALYSIS_NOT_FOUND } from '../constants/errorCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { analyzeAudio } from '../services/audioAnalysisService.js'
import { youtubeSearch } from '../services/youtubeSearchService.js'
import AppError from '../utils/AppError.js'
import { sseHeaders, writeSseResponse } from '../utils/sse.js'
import { tryCatch } from '../utils/tryCatch.js'

const SOURCES = {
  YOUTUBE: 'youtube'
}

export const getAllAudioAnalyses = tryCatch(async (req, res) => {
  const { source, query } = req.query
  const { page } = req.body

  const { items, nextPage } = await youtubeSearch({ query, page })
  const itemsIds = items.map(item => item.id)
  const audioAnalyses = await AudioAnalysis.findAllByYoutubeIds({ youtubeIds: itemsIds })
  const newItems = items.map(item => {
    const isAnalyzed = audioAnalyses[item.id] !== undefined
    return { ...item, isAnalyzed }
  })

  res.status(200).json({
    status: 'success',
    results: newItems,
    nextPage
  })
})

export const getAudioAnalysis = tryCatch(async (req, res) => {
  const { youtubeId } = req.params

  const audioAnalysis = await AudioAnalysis.findByYoutubeId({ youtubeId })

  if (!audioAnalysis) throw new AppError(AUDIO_ANALYSIS_NOT_FOUND, 'Audio analysis not found.', 404)

  res.status(200).json({
    status: 'success',
    data: {
      audioAnalysis: {
        id: audioAnalysis.id,
        youtubeId: audioAnalysis.youtubeId,
        chords: audioAnalysis.chords,
        bpm: audioAnalysis.bpm,
        beatTimes: audioAnalysis.beatTimes
      }
    }
  })
}
)
export const createAudioAnalysis = tryCatch(async (req, res) => {
  res.writeHead(200, sseHeaders)

  const { youtubeId } = req.body
  const audioAnalysis = await AudioAnalysis.findByYoutubeId({ youtubeId })
  if (audioAnalysis) throw new AppError(AUDIO_ALREADY_ANALYZED, 'Audio already analyzed.', 409)

  const newAudioAnalysis = await analyzeAudio({ youtubeId })

  const response = {
    data: {
      audioAnalysis: {
        id: newAudioAnalysis.id,
        youtubeId: newAudioAnalysis.youtubeId,
        chords: newAudioAnalysis.chords,
        bpm: newAudioAnalysis.bpm,
        beatTimes: newAudioAnalysis.beatTimes
      }
    }
  }
  writeSseResponse(res, { event: 'success', data: response })
  res.end()
})
