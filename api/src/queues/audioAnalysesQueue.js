import { Queue, QueueEvents, Worker } from 'bullmq'
import redisConfig from '../config/redis.js'
import Redis from 'ioredis'
import { analyzeAudioProcessor } from '../processors/analyzeAudioProcessor.js'

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
      // removeOnComplete: true,
      // removeOnFail: true
      // delay: 1000,
    }
  }
)

await audioAnalysesQueue.clean(true)

export const findAudioAnalysisJob = async ({ id }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  const job = await audioAnalysesQueue.getJob(id)
  return job !== undefined
    ? {
        // status: job.progress?.status || AUDIO_ANALYSIS_STATUS.waiting,
        progress: job.progress?.progress ?? null,
        result: job.returnvalue,
        failedReason: job.failedReason
      }
    : undefined
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
    jobId: id
  })

  return {
    // status: job.progress?.status || AUDIO_ANALYSIS_STATUS.waiting,
    progress: job.progress?.progress ?? null,
    result: job.returnvalue,
    failedReason: job.failedReason
  }
}

export const updateAudioAnalysisJobProgress = async (job, { progress }) => {
  await job.updateProgress({ progress })
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
