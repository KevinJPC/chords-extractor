import { Queue, Worker } from 'bullmq'
import redisConfig from '../config/redis.js'
import Redis from 'ioredis'
import { analyzeAudioProcessor } from '../processors/analyzeAudioProcessor.js'
import { audioAnalysisJobService } from '../services/audioAnalysisJobService.js'

const redisClient = new Redis({
  ...redisConfig,
  enableOfflineQueue: true, // fast failing if redis is down, worker will override this opt,
  maxRetriesPerRequest: 1
})

export const AUDIO_ANALYSIS_QUEUE_NAME = 'audio-analyses'

// Queue

const audioAnalysesQueue = new Queue(
  AUDIO_ANALYSIS_QUEUE_NAME, {
    connection: redisClient
  })

export const findAudioAnalysisJob = async ({ id }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  const job = await audioAnalysesQueue.getJob(id)
  return job
}

export const createAudioAnalysisJob = async ({
  id, data: {
    youtubeId,
    title,
    duration,
    thumbnails
  }
}) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  const job = await audioAnalysesQueue.add('audioAnalysis', {
    youtubeId,
    title,
    duration,
    thumbnails
  }, {
    jobId: id,
    removeOnComplete: true,
    removeOnFail: true
  })
  return job
}

export const getJobState = async ({ job }) => {
  const state = await job.getState()
  return state
}

// Worker

const audioAnalysesWorker = new Worker(
  AUDIO_ANALYSIS_QUEUE_NAME,
  analyzeAudioProcessor, {
    connection: { ...redisConfig },
    removeOnComplete: true,
    removeOnFail: true,
    concurrency: 1
  }
)

// Worker listeners

audioAnalysesWorker.on('progress', (job, jobProgress) => {
  console.log('job: ', job.id, ' progress: ', jobProgress)
})

audioAnalysesWorker.on('active', (job) => {
  console.log('active: notifing clients ', job.id)
  audioAnalysisJobService.onActive({ observableId: job.id })
})

audioAnalysesWorker.on('completed', (job, result) => {
  console.log('job: ', job.id, ' completed: ')
  audioAnalysisJobService.onComplete({ observableId: job.id, result })
})

audioAnalysesWorker.on('failed', (job, error) => {
  console.log('job: ', job.id, ' failed: ', error)
  audioAnalysisJobService.onFailed({ observableId: job.id, error })
})

audioAnalysesWorker.on('error', (failedReason) => {
  console.log('error: ', failedReason)
  audioAnalysisJobService.onError({ failedReason })
})
