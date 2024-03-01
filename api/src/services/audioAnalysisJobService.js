import { YOUTUBE_VIDEO_NOT_FOUND } from '../constants/errorCodes.js'
import { NOT_FOUND } from '../constants/httpCodes.js'
import { createJob, findJob, getJobStatus, retryJob } from '../queues/audioAnalysesQueue.js'
import AppError from '../utils/AppError.js'
import { youtubeService } from './youtubeService.js'

const createAudioAnalysisJob = async ({ id }) => {
  let job = await findJob({ id })

  if (job === undefined) {
    const video = await youtubeService.findVideo({ id })
    if (video === undefined) throw new AppError(YOUTUBE_VIDEO_NOT_FOUND, 'Youtube video not found', NOT_FOUND)
    const { title, duration, thumbnails } = video
    // TODO: validate song max duration
    job = await createJob({ id, data: { youtubeId: id, title, duration, thumbnails } })
  } else {
    if (job.failedReason !== undefined) await retryJob({ job })
  }

  const status = await getJobStatus({ id })
  if (status === undefined) throw new AppError('NOT_JOB_STATUS', 'Could not get job status', 400)
  return { id: job.id, status }
}

const findAudioAnalysisJob = async ({ id }) => {
  const job = await findJob({ id })
  if (job === undefined) throw new AppError('AUDIO_ANALYSIS_JOB_NOT_FOUND', 'Audio analysis job not found', 404)

  const status = await getJobStatus({ id })
  if (status === undefined) throw new AppError('NOT_JOB_STATUS', 'Could not get job status', 400)

  return { id: job.id, status }
}

export default { createAudioAnalysisJob, findAudioAnalysisJob }
