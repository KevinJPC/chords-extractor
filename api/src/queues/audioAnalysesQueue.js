import { Queue, QueueEvents, Worker } from 'bullmq'
import redisConfig from '../config/redis.js'
import Redis from 'ioredis'
import { analyzeAudioProcessor } from '../processors/analyzeAudioProcessor.js'
import { AUDIO_ANALYSIS_STATUS } from '../../../constants/audioAnalisesStatus.js'

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

// await audioAnalysesQueue.clean(2000, 3)
// await audioAnalysesQueue.clean(2000, 3, 'failed')

export const retryJob = async ({ job }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995

  // await job.updateProgress({ started: false })
  await job.retry()

  const newJobInfo = findJob({ id: job.id })
  //
  return newJobInfo
}

export const findJob = async ({ id }) => {
  await redisClient.ping() // suggested workaround temporary for issue: https://github.com/taskforcesh/bullmq/issues/995
  const job = await audioAnalysesQueue.getJob(id)

  if (job === undefined) return undefined
  return job
}

export const getJobStatus = ({ job }) => {
  console.log('failedReason', job.failedReason)
  if (job.failedReason !== undefined) return AUDIO_ANALYSIS_STATUS.error
  if (job.returnvalue !== null) return AUDIO_ANALYSIS_STATUS.completed
  if (job.progress?.started === true) return AUDIO_ANALYSIS_STATUS.processing
  return AUDIO_ANALYSIS_STATUS.waiting
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
