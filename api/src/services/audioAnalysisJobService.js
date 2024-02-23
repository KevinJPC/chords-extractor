import { AUDIO_ANALYSIS_STATUS } from '../constants/audioAnalysesStatus.js'
import { YOUTUBE_VIDEO_NOT_FOUND } from '../constants/errorCodes.js'
import { NOT_FOUND } from '../constants/httpCodes.js'
import { createAudioAnalysisJob, findAudioAnalysisJob } from '../queues/audioAnalysesQueue.js'
import AppError from '../utils/AppError.js'
import { youtubeService } from './youtubeService.js'

class AudioAnalysisJobService {
  async analyze ({ youtubeId, onNotify, onError }) {
    let job = await findAudioAnalysisJob({ id: youtubeId })
    if (job === undefined) {
      const video = await youtubeService.findVideo({ id: youtubeId })
      if (video === undefined) throw new AppError(YOUTUBE_VIDEO_NOT_FOUND, 'Youtube video not found', NOT_FOUND)
      const { title, duration, thumbnails } = video
      // TODO: validate song max duration
      job = await createAudioAnalysisJob({ id: youtubeId, data: { youtubeId, title, duration, thumbnails } })
    }
    const { progress, result, failedReason } = job

    let jobState = { progress, result, failedReason }

    const updateJobState = (newState) => {
      jobState = { ...jobState, ...newState }
      return jobState
    }

    const checkJobStateHasChanged = (newState) => {
      return jobState.progress !== newState.progress ||
      jobState.result !== newState.result ||
      jobState.failedReason !== newState.failedReason
    }

    const handleJobState = async (newJobState) => {
      if (checkJobStateHasChanged(newJobState) === false) return
      const { failedReason, progress, result } = updateJobState(newJobState)
      console.log('failedReason', failedReason)
      if (failedReason !== undefined) {
        clearInterval(intervalId)
        return onError(new Error('Error analyzing audio'))
      }
      if (result !== null) {
        clearInterval(intervalId)
        return onNotify({ status: AUDIO_ANALYSIS_STATUS.success, progress: 100, result })
      }
      if (progress === null) return onNotify({ status: AUDIO_ANALYSIS_STATUS.waiting, progress: null, result: null })
      return onNotify({ status: AUDIO_ANALYSIS_STATUS.processing, progress, result: null })
    }

    if (failedReason !== undefined || result !== null) return

    const intervalId = setInterval(async () => {
      try {
        const newJobState = await findAudioAnalysisJob({ id: youtubeId })
        await handleJobState(newJobState)
      } catch (error) {
        onError(error)
        clearInterval(intervalId)
      }
    }, 1000)
    const disconect = () => {
    }
    return { disconect }
  }
}

export const audioAnalysisJobService = new AudioAnalysisJobService()
