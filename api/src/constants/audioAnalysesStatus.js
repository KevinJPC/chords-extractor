export const AUDIO_ANALYSIS_STATUS = {
  waiting: 'waiting',
  error: 'error',
  completed: 'completed',
  processing: 'processing'
}

export const BULLMQ_JOB_STATES = {
  waiting: 'waiting',
  'waiting-children': 'waiting-children',
  delayed: 'delayed',
  failed: 'failed',
  unknown: 'unknown',
  active: 'active',
  completed: 'completed'
}

export const AUDIO_ANALYSIS_STATUS_BY_JOB_STATES = {
  [BULLMQ_JOB_STATES.waiting]: AUDIO_ANALYSIS_STATUS.waiting,
  [BULLMQ_JOB_STATES['waiting-children']]: AUDIO_ANALYSIS_STATUS.waiting,
  [BULLMQ_JOB_STATES.delayed]: AUDIO_ANALYSIS_STATUS.waiting,
  [BULLMQ_JOB_STATES.failed]: AUDIO_ANALYSIS_STATUS.error,
  [BULLMQ_JOB_STATES.unknown]: AUDIO_ANALYSIS_STATUS.error,
  [BULLMQ_JOB_STATES.active]: AUDIO_ANALYSIS_STATUS.processing,
  [BULLMQ_JOB_STATES.completed]: AUDIO_ANALYSIS_STATUS.completed
}
