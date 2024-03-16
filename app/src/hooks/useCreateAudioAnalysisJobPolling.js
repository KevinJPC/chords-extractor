import { useMutation, useQuery } from '@tanstack/react-query'
import { createAudioAnalysisJob, getAudioAnalysisJob } from '../services/audioAnalyses.js'
import { AUDIO_ANALYSIS_STATUS } from '../../../constants/audioAnalysisStatus.js'
import { useMemo } from 'react'
import { queryClient } from '../config/queryClient.js'

export const useCreateAudioAnalysisJobPolling = () => {
  const { isSuccess: mutationIsSuccess, isPending: mutationIsPending, data: mutationData, error: mutationError, mutate } = useMutation({
    mutationKey: ['job'],
    mutationFn: createAudioAnalysisJob,
    gcTime: 0
  })
  const { data: queryData, error: queryError } = useQuery({
    queryKey: ['job'],
    queryFn: () => getAudioAnalysisJob({ jobId: mutationData.id }),
    enabled: mutationIsSuccess && mutationData?.id !== null && [AUDIO_ANALYSIS_STATUS.waiting, AUDIO_ANALYSIS_STATUS.processing].includes(mutationData?.status),
    refetchInterval: (query) => {
      if ([AUDIO_ANALYSIS_STATUS.waiting, AUDIO_ANALYSIS_STATUS.processing].includes(query.state.data?.status)) return 1000
      return false
    },
    gcTime: 0, // garbage collected time
    refetchOnWindowFocus: false
    // refetchOnMount: false
  })

  const { jobResult, jobIsFailed, jobIsInQueue, jobIsProcessing, jobIsCompleted, error } = useMemo(() => {
    const job = mutationData !== undefined || queryData !== undefined ? { ...mutationData, ...queryData } : undefined
    const jobIsFailed = job?.status === AUDIO_ANALYSIS_STATUS.failed
    const jobIsInQueue = job?.status === AUDIO_ANALYSIS_STATUS.waiting
    const jobIsProcessing = job?.status === AUDIO_ANALYSIS_STATUS.processing
    const jobIsCompleted = job?.status === AUDIO_ANALYSIS_STATUS.completed
    const error = mutationError !== null || queryError !== null ? { ...mutationError, ...queryError } : null
    return { jobResult: job?.result, jobIsFailed, jobIsInQueue, jobIsProcessing, jobIsCompleted, error }
  }, [mutationData, queryData, mutationError, queryError])

  const runAudioAnalysisJobMutation = ({ youtubeId }) => {
    queryClient.resetQueries({ queryKey: 'job', exact: true }) // reset job query data
    mutate({ youtubeId })
  }

  return { jobResult, jobIsFailed, jobIsInQueue, jobIsCompleted, jobIsProcessing, error, createJob: runAudioAnalysisJobMutation, jobCreationIsPending: mutationIsPending }
}
