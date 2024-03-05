import * as errorCodes from '../constants/errorCodes.js'
import * as httpCodes from '../constants/httpCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import audioAnalysisJobService from '../services/audioAnalysisJobService.js'
import { youtubeService } from '../services/youtubeService.js'
import AppError from '../utils/AppError.js'
import { tryCatch } from '../utils/tryCatch.js'

export const getAudioAnalysis = tryCatch(async (req, res) => {
  const { id } = req.params

  const audioAnalysis = await AudioAnalysis.findById({ id })

  if (audioAnalysis === null) throw new AppError(errorCodes.NOT_FOUND, 'Audio analysis not found.', httpCodes.NOT_FOUND)

  res.status(httpCodes.OK).json({
    status: 'success',
    data: { ...audioAnalysis }
  })
}
)

export const createAudioAnalysisJob = tryCatch(async (req, res) => {
  const { youtubeId } = req.body
  if (youtubeId === undefined) throw new Error('Youtube id was not provided')

  const job = await audioAnalysisJobService.createAudioAnalysisJob({ id: youtubeId })

  res.status(httpCodes.CREATED).json({
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

  res.status(httpCodes.OK).json({
    status: 'success',
    data: {
      id: job.id,
      status: job.status,
      result: job.result
    }
  })
})

export const getYoutubeResultsWithAnalyzeStatus = tryCatch(async (req, res) => {
  const { q, continuation } = req.query

  const { results, continuation: nextContinuation } = await youtubeService.search({ query: q, continuation })

  const resultsIds = results.map(result => result.id)

  const resultsAlreadyAnalyzed = await AudioAnalysis.findAllOriginalsByYoutubeIds({ youtubeIds: resultsIds })

  const mappedResults = results.map(({ id: youtubeId, title, thumbnails, duration }) => {
    const audioAnalysis = resultsAlreadyAnalyzed.find(audioAnalysis => audioAnalysis.youtubeId === youtubeId)

    return {
      youtubeId,
      title,
      thumbnails,
      duration,
      isAnalyzed: audioAnalysis !== undefined,
      audioAnalysis: audioAnalysis !== undefined
        ? {
            _id: audioAnalysis._id,
            edits: audioAnalysis.edits,
            bpm: audioAnalysis.bpm
          }
        : null
    }
  })

  res.status(httpCodes.OK).json({
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
