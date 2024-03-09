import { AUDIO_ANALYSIS_STATUS } from '../../../constants/audioAnalisesStatus.js'
import { YOUTUBE_VIDEO_NOT_FOUND } from '../constants/errorCodes.js'
import { NOT_FOUND } from '../constants/httpCodes.js'
import AudioAnalysis from '../models/AudioAnalysis.js'
import { createJob, findJob, getJobStatus, retryJob } from '../queues/audioAnalysesQueue.js'
import AppError from '../utils/AppError.js'
import { youtubeService } from './youtubeService.js'

const createAudioAnalysisJob = async ({ id }) => {
  const audioAnalysis = await AudioAnalysis.findOriginalByYoutubeId({ youtubeId: id })
  // return default fake job values and the already analyze audio info
  if (audioAnalysis !== null) return { id: null, status: AUDIO_ANALYSIS_STATUS.completed, result: audioAnalysis }

  let job = await findJob({ id })
  if (job === undefined) {
    const video = await youtubeService.findVideo({ id })
    if (video === undefined) throw new AppError(YOUTUBE_VIDEO_NOT_FOUND, 'Youtube video not found', NOT_FOUND)
    const { title, duration, thumbnails } = video
    // TODO: validate song max duration
    job = await createJob({ id, data: { youtubeId: id, title, duration, thumbnails } })
  } else if (job.failedReason !== undefined) job = await retryJob({ job })

  const serializeJobStatus = getJobStatus({ job })

  return { id: job.id, status: serializeJobStatus, result: job.returnvalue }
}

const findAudioAnalysisJob = async ({ id }) => {
  const job = await findJob({ id })
  if (job === undefined) throw new AppError('AUDIO_ANALYSIS_JOB_NOT_FOUND', 'Audio analysis job not found', 404)

  const serializeJobStatus = getJobStatus({ job })

  return { id: job.id, status: serializeJobStatus, result: job.returnvalue }
}

export default { createAudioAnalysisJob, findAudioAnalysisJob }
