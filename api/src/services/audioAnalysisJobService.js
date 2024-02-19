import { AUDIO_ANALYSIS_STATUS, AUDIO_ANALYSIS_STATUS_BY_JOB_STATES, BULLMQ_JOB_STATES } from '../constants/audioAnalysesStatus.js'
import { YOUTUBE_VIDEO_NOT_FOUND } from '../constants/errorCodes.js'
import { NOT_FOUND } from '../constants/httpCodes.js'
import { createAudioAnalysisJob, findAudioAnalysisJob, getJobState } from '../queues/audioAnalysesQueue.js'
import AppError from '../utils/AppError.js'
import { YoutubeVideoDetails } from './youtubeService.js'

class AudioAnalysisJobService {
  #observables
  constructor () {
    this.#observables = {}
  }

  #findAllJobObservables () {
    return Object.entries(this.#observables)
  }

  #findJobObservable ({ id }) {
    return this.#observables[id]
  }

  #createJobObservable ({ id, status }) {
    const observable = this.#observables[id] = new ObservableAudioAnalysisJob({ id, state: { status } })
    return observable
  }

  #deleteJobObservable ({ id }) {
    delete this.#observables[id]
  }

  #getJobStatusByState = ({ state }) => {
    const jobStatus = AUDIO_ANALYSIS_STATUS_BY_JOB_STATES[state] || AUDIO_ANALYSIS_STATUS.error
    return jobStatus
  }

  onActive ({ observableId }) {
    const jobObservable = this.#findJobObservable({ id: observableId })
    jobObservable?.notify({ status: this.#getJobStatusByState({ state: BULLMQ_JOB_STATES.active }) })
  }

  onComplete ({ observableId, result }) {
    const jobObservable = this.#findJobObservable({ id: observableId })
    jobObservable?.notify({ status: this.#getJobStatusByState({ state: BULLMQ_JOB_STATES.completed }), result })
    this.#deleteJobObservable({ id: observableId })
  }

  onFailed ({ observableId, error }) {
    const jobObservable = this.#findJobObservable({ id: observableId })
    jobObservable?.error(error)
    this.#deleteJobObservable({ id: observableId })
  }

  onError ({ failedReason }) {
    const jobObservables = this.#findAllJobObservables()
    for (const [id, jobObservable] of jobObservables) {
      jobObservable.error(new Error(failedReason))
      this.#deleteJobObservable({ id })
    }
  }

  async analyze ({ youtubeId }) {
    let job = await findAudioAnalysisJob({ id: youtubeId })
    if (job === undefined) {
      const videoDetails = await YoutubeVideoDetails.search({ id: youtubeId })
      if (videoDetails === undefined) throw new AppError(YOUTUBE_VIDEO_NOT_FOUND, 'Youtube video not found', NOT_FOUND)
      const { title, duration, thumbnails } = videoDetails
      // TODO: validate song max duration
      job = await createAudioAnalysisJob({ id: youtubeId, data: { youtubeId, title, duration, thumbnails } })
    }

    let observable = this.#findJobObservable({ id: job.id })
    if (observable === undefined) {
      const state = await getJobState({ job })
      const status = this.#getJobStatusByState({ state })
      observable = this.#createJobObservable({ id: job.id, status })
    }

    return observable
  }
}

export class ObservableAudioAnalysisJob {
  #id
  #observers
  #state
  constructor ({ id, state }) {
    this.#id = id
    this.#observers = []
    this.#state = state
  }

  subscribe (observer) {
    console.log(`new ${this.#id} job subscriber`)
    observer.onNotify(this.#state) // notify current state to subscriber
    this.#observers.push(observer)
  }

  unsubscribe (observer) {
    console.log(`unsubscribed of ${this.#id} job`)

    this.#observers = this.#observers.filter(observerHandlers => observerHandlers !== observer)
  }

  notify (newState) {
    this.#state = { ...this.#state, ...newState }
    for (const observer of this.#observers) {
      observer.onNotify(this.#state)
    }
  }

  error (error) {
    for (const observer of this.#observers) {
      observer.onError(error)
    }
  }
}

export const audioAnalysisJobService = new AudioAnalysisJobService()
