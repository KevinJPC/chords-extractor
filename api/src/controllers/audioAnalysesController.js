import { AUDIO_ALREADY_ANALYZED, AUDIO_ANALYSIS_NOT_FOUND } from '../constants/errorCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { analyzeAudio } from '../services/audioAnalysisService.js'
import YoutubeService from '../services/youtubeService.js'
import AppError from '../utils/AppError.js'
import { sseHeaders, writeSseResponse } from '../utils/sse.js'
import { tryCatch } from '../utils/tryCatch.js'

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

export const getAllAudioAnalysesBySource = (req, res, next) => {
  const { source } = req.query

  const SOURCES = {
    YOUTUBE: 'youtube'
  }
  const GET_ALL_AUDIO_ANALYSES_CONTROLLERS_BY_SOURCES = {
    [SOURCES.YOUTUBE]: getAllAudioAnalysesBaseOnYoutubeSearch
  }

  const searchController = GET_ALL_AUDIO_ANALYSES_CONTROLLERS_BY_SOURCES[source] || getAllAudioAnalyses
  searchController(req, res, next)
}

export const getAllAudioAnalysesBaseOnYoutubeSearch = tryCatch(async (req, res) => {
  const { searchQuery } = req.query
  const { page } = req.body

  const youtubeService = await YoutubeService.search({ searchQuery, page })
  const resultsIds = youtubeService.getResultsIds()
  const resultsAlreadyAnalyzed = await AudioAnalysis.findAllByYoutubeIds({ youtubeIds: resultsIds })
  youtubeService.mappedResultsBaseOnAnalyzed({ resultsAlreadyAnalyzed })

  res.status(200).json({
    status: 'success',
    data: {
      results: youtubeService.results,
      page,
      nextPage: youtubeService.nextPage
    }
  })
})

export const getAllAudioAnalyses = tryCatch(async (req, res) => {
  const { page } = req.body

  res.status(501).json({
    status: 'fail',
    message: 'Not implemented yet',
    data: {}
  })
})
