import { Queue, QueueEvents, Worker, QueueGetters } from 'bullmq'
import redisConfig from '../config/redis.js'
import Redis from 'ioredis'
import { analyzeAudioProcessor } from '../processors/analyzeAudioProcessor.js'
import { AUDIO_ANALYSIS_STATUS_BY_JOB_STATES, AUDIO_ANALYSIS_STATUS, BULLMQ_JOB_STATES } from '../constants/audioAnalysesStatus.js'

const redisClient = new Redis({
  ...redisConfig,
  enableOfflineQueue: true, // fast failing if redis is down, worker will override this opt,
  maxRetriesPerRequest: 1
})

export const AUDIO_ANALYSIS_QUEUE_NAME = 'audio-analyses'

// Queue

const audioAnalysesQueue = new Queue(
  AUDIO_ANALYSIS_QUEUE_NAME, {
    connection: redisClient,
    defaultJobOptions: {
      removeOnComplete: {
        age: 30
      },
      removeOnFail: {
        age: 30
      }
      // removeOnFail: true
      // delay: 1000,
    }
  }
)

await audioAnalysesQueue.clean(2000, 2)

export const retryJob = async ({ job }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  await job.retry()
}

export const findJob = async ({ id }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  const job = await audioAnalysesQueue.getJob(id)
  return job
}

export const getJobStatus = async ({ id }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  const state = await audioAnalysesQueue.getJobState(id)
  if (state === BULLMQ_JOB_STATES.unknown) return undefined
  const status = AUDIO_ANALYSIS_STATUS_BY_JOB_STATES[state] || AUDIO_ANALYSIS_STATUS.error
  return status
}

export const createJob = async ({
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
    jobId: id
  })

  return job
}

// Worker

const audioAnalysesWorker = new Worker(
  AUDIO_ANALYSIS_QUEUE_NAME,
  analyzeAudioProcessor, {
    connection: { ...redisConfig },
    concurrency: 1
  }
)

const audioAnalysesQueueEvents = new QueueEvents(AUDIO_ANALYSIS_QUEUE_NAME, {
  connection: {
    ...redisConfig
  }
})
// listeners
audioAnalysesQueueEvents.on('progress', ({ jobId, data }) => {
  console.log('job progress: ', jobId, ' progress: ', data)
})

audioAnalysesQueueEvents.on('waiting', ({ jobId }) => {
  console.log('job waiting:', jobId)
})

audioAnalysesQueueEvents.on('active', ({ jobId }) => {
  console.log('job active: ', jobId)
})

audioAnalysesQueueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log('job completed: ', jobId, ' audioAnalysis id:', returnvalue._id)
})

audioAnalysesQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log('job: ', failedReason, ' failed: ', failedReason)
})

audioAnalysesQueueEvents.on('error', ({ name, message, stack }) => {
  console.log('error: ', name)
})
