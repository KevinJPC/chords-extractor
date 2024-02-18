export class ObservableAudioAnalysisJob {
  jobId
  #observers
  #state
  constructor ({ jobId, state }) {
    this.jobId = jobId
    this.#observers = []
    this.#state = state
  }

  subscribe (observer) {
    console.log(`new ${this.jobId} job subscriber`)
    observer.onNotify(this.#state) // notify current state to subscriber
    this.#observers.push(observer)
  }

  unsubscribe (observer) {
    console.log(`unsubscribed of ${this.jobId} job`)

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
