import { AUDIO_ALREADY_ANALYZED, AUDIO_ANALYSIS_NOT_FOUND } from '../constants/errorCodes.js'
import { CONFLICT, CREATED, NOT_FOUND, OK } from '../constants/httpCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import audioAnalysisJobService from '../services/audioAnalysisJobService.js'
import { youtubeService } from '../services/youtubeService.js'
import AppError from '../utils/AppError.js'
import { tryCatch } from '../utils/tryCatch.js'

export const getAudioAnalysisByYoutubeId = tryCatch(async (req, res) => {
  const { youtubeId } = req.params
  const { edit } = req.query

  let audioAnalysis = null
  if (edit === undefined) {
    audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId })
  } else {
    audioAnalysis = await AudioAnalysis.findEdit({ youtubeId, id: edit })
  }

  if (audioAnalysis === undefined) throw new AppError(AUDIO_ANALYSIS_NOT_FOUND, 'Audio analysis not found.', NOT_FOUND)

  res.status(OK).json({
    status: 'success',
    data: { ...audioAnalysis }
  })
}
)

export const createAudioAnalysisJob = tryCatch(async (req, res) => {
  const { youtubeId } = req.body
  if (youtubeId === undefined) throw new Error('Youtube id was not provided')

  const job = await audioAnalysisJobService.createAudioAnalysisJob({ id: youtubeId })

  res.status(CREATED).json({
    status: 'success',
    data: {
      id: job.id,
      status: job.status,
      result: job.result
    }
  })
})

export const getAudioAnalysisJob = tryCatch(async (req, res) => {
  const { id } = req.params

  const job = await audioAnalysisJobService.findAudioAnalysisJob({ id })

  res.status(OK).json({
    status: 'success',
    data: {
      id: job.id,
      status: job.status,
      result: job.result
    }
  })
})

export const getYoutubeResultsWithAnalyzeStatus = tryCatch(async (req, res) => {
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
