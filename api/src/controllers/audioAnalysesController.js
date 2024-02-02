import { AUDIO_ALREADY_ANALYZED, AUDIO_ANALYSIS_NOT_FOUND } from '../constants/errorCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { analyzeAudio } from '../services/audioAnalysisService.js'
import { YoutubeList } from '../services/youtubeService.js'
import AppError from '../utils/AppError.js'
import { sseHeaders, writeSseResponse } from '../utils/sse.js'
import { tryCatch } from '../utils/tryCatch.js'

export const getAudioAnalysis = tryCatch(async (req, res) => {
  const { id } = req.params

  const audioAnalysis = await AudioAnalysis.findById({ id })

  if (!audioAnalysis) throw new AppError(AUDIO_ANALYSIS_NOT_FOUND, 'Audio analysis not found.', 404)

  res.status(200).json({
    status: 'success',
    data: { ...audioAnalysis }
  })
}
)
export const createAudioAnalysis = tryCatch(async (req, res) => {
  res.writeHead(200, sseHeaders)
  const { youtubeId } = req.body

  if (youtubeId === undefined) throw new Error('Youtube id was not provided')

  const audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId })
  if (audioAnalysis) throw new AppError(AUDIO_ALREADY_ANALYZED, 'Audio already analyzed.', 409)

  const newAudioAnalysis = await analyzeAudio({ youtubeId })

  const response = {
    data: { ...newAudioAnalysis }
  }
  writeSseResponse(res, { event: 'success', data: response })
  res.end()
})

export const getAllOriginalsAudioAnalysesBySource = (req, res, next) => {
  const { source } = req.query

  const SOURCES = {
    YOUTUBE: 'youtube'
  }
  const GET_ALL_AUDIO_ANALYSES_CONTROLLERS_BY_SOURCES = {
    [SOURCES.YOUTUBE]: getAllOriginalsAudioAnalysesByYoutubeSearch
  }

  const searchController = GET_ALL_AUDIO_ANALYSES_CONTROLLERS_BY_SOURCES[source] || getAllAudioAnalyses
  searchController(req, res, next)
}

export const getAllOriginalsAudioAnalysesByYoutubeSearch = tryCatch(async (req, res) => {
  const { searchQuery, continuation } = req.query

  const youtubeService = await YoutubeList.search({ searchQuery, continuation })
  const resultsIds = youtubeService.getResultsIds()
  const resultsAlreadyAnalyzed = await AudioAnalysis.findAllOriginalsByYoutubeIds({ youtubeIds: resultsIds })
  youtubeService.mappedResultsBaseOnAnalyzed({ resultsAlreadyAnalyzed })

  res.status(200).json({
    status: 'success',
    data: {
      results: youtubeService.results,
      continuation: youtubeService.continuation
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
