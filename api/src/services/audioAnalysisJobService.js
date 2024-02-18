import { Worker } from 'bullmq'
import { AUDIO_ANALYSIS_STATUS, AUDIO_ANALYSIS_STATUS_BY_JOB_STATES, BULLMQ_JOB_STATES } from '../constants/audioAnalysesStatus'
import { ObservableAudioAnalysisJob } from '../observables/ObservableAudioAnalysisJob'
import { audioAnalysesQueue } from '../queues/audioAnalysesQueue'
import { analyzeAudioProcessor } from '../processors/analyzeAudioProcessor'
import redisConfig from '../config/redis'
import AppError from '../utils/AppError'
import { YoutubeVideoDetails } from './youtubeService'

class AudioAnalysisJobService {
  #observables
  #worker
  constructor () {
    this.#worker = new Worker(
      audioAnalysesQueue.name,
      analyzeAudioProcessor, {
        connection: { ...redisConfig },
        removeOnComplete: true,
        removeOnFail: true,
        concurrency: 1
      }
    )
    this.#setupListeners()
  }

  #setupListeners () {
    this.#worker.on('progress', (job, jobProgress) => {
      console.log('job: ', job.id, ' progress: ', jobProgress)
    })

    this.#worker.on('active', (job) => {
      console.log('active: notifing clients ', job.id)
      const jobObservable = this.#findJobObservable({ jobId: job.id })
      jobObservable?.notify({ status: this.#getJobStatusByState(BULLMQ_JOB_STATES.active) })
    })

    this.#worker.on('completed', (job, result) => {
      console.log('job: ', job.id, ' completed: ')
      const jobObservable = this.#findJobObservable({ jobId: job.id })
      jobObservable?.notify({ status: this.#getJobStatusByState(BULLMQ_JOB_STATES.completed), result })
      this.#deleteJobObservable({ jobId: job.id })
    })

    this.#worker.on('failed', (job, error) => {
      console.log('job: ', job.id, ' failed: ')
      const jobObservable = this.#findJobObservable({ jobId: job.id })
      jobObservable?.error(error)
      this.#deleteJobObservable({ jobId: job.id })
    })

    this.#worker.on('error', (failedReason) => {
      Object.entries(this.observablesJob).forEach(([jobId, jobObservable]) => {
        jobObservable.error(new Error(failedReason))
        this.#deleteJobObservable({ jobId })
      })
    })
  }

  async #findJob (jobId) {
    const job = await audioAnalysesQueue.getJob(jobId)
    return job
  }

  async #createJob (jobId) {
    const job = await audioAnalysesQueue.add('audioAnalysis', {
      youtubeId: jobId
    }, {
      jobId,
      removeOnComplete: true,
      removeOnFail: true
    })
    return job
  }

  #getJobStatusByState (jobState) {
    const jobStatus = AUDIO_ANALYSIS_STATUS_BY_JOB_STATES[jobState] || AUDIO_ANALYSIS_STATUS.error
    return jobStatus
  }

  #findJobObservable (jobId) {
    return this.#observables[jobId]
  }

  #createJobObservable ({ jobId, status }) {
    const observable = this.#observables[jobId] = new ObservableAudioAnalysisJob({ jobId, state: { status } })
    return observable
  }

  #deleteJobObservable (jobId) {
    delete this.#observables[jobId]
  }

  async analyze (youtubeId) {
    let job = this.#findJob(youtubeId)
    if (job === undefined) {
      const videoDetails = await YoutubeVideoDetails.search({ id: youtubeId })
      if (videoDetails === undefined) throw new AppError(1, 'Youtube song not found', 404)
      job = this.#createJob(youtubeId)
    }

    let observable = this.#findJobObservable(job.id)
    if (observable === undefined) {
      const jobState = await job.getState()
      const status = this.#getJobStatusByState({ jobState })
      observable = this.#createJobObservable({ jobId: job.id, status })
    }

    return observable
  }
}

export const audioAnalysisJobService = new AudioAnalysisJobService()
