import { AUDIO_ALREADY_ANALYZED, AUDIO_ANALYSIS_NOT_FOUND } from '../constants/errorCodes.js'
import { CONFLICT, NOT_FOUND, OK } from '../constants/httpCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import audioAnalysisJobService from '../services/audioAnalysisJobService.js'
import { youtubeService } from '../services/youtubeService.js'
import AppError from '../utils/AppError.js'
import { tryCatch } from '../utils/tryCatch.js'

export const getAudioAnalysis = tryCatch(async (req, res) => {
  const { id } = req.params

  const audioAnalysis = await AudioAnalysis.findById({ id })

  if (!audioAnalysis) throw new AppError(AUDIO_ANALYSIS_NOT_FOUND, 'Audio analysis not found.', NOT_FOUND)

  res.status(OK).json({
    status: 'success',
    data: { ...audioAnalysis }
  })
}
)

export const createAudioAnalysisJob = tryCatch(async (req, res) => {
  const { youtubeId } = req.body
  if (youtubeId === undefined) throw new Error('Youtube id was not provided')

  const audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId })
  if (audioAnalysis) throw new AppError(AUDIO_ALREADY_ANALYZED, 'Audio already analyzed.', CONFLICT)

  const job = await audioAnalysisJobService.createAudioAnalysisJob({ id: youtubeId })

  res.status(OK).json({
    status: 'success',
    data: { id: job.id }
  })
})

export const getAudioAnalysisJob = tryCatch(async (req, res) => {
  const { id } = req.params

  const { status, result } = await audioAnalysisJobService.findAudioAnalysisJob({ id })

  res.status(OK).json({
    status: 'success',
    data: {
      status,
      result
    }
  })
  // throw new AppError(null, 'Feature not implemented', 501)
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

  const { results, continuation: nextContinuation } = await youtubeService.search({ query: searchQuery, continuation })

  const resultsIds = results.map(result => result.id)

  const resultsAlreadyAnalyzed = await AudioAnalysis.findAllOriginalsByYoutubeIds({ youtubeIds: resultsIds })

  const mappedResults = results.map(({ id: youtubeId, title, thumbnails, duration }) => {
    const audioAnalysis = resultsAlreadyAnalyzed.find(audioAnalysis => audioAnalysis.youtubeId === youtubeId)
    return { youtubeId, title, thumbnails, duration, ...audioAnalysis }
  })

  res.status(OK).json({
    status: 'success',
    data: {
      results: mappedResults,
      continuation: nextContinuation
    }
  })
})

export const getAllAudioAnalyses = tryCatch(async (req, res) => {
  // const { page } = req.body

  res.status(501).json({
    status: 'fail',
    message: 'Not implemented yet',
    data: {}
  })
})
