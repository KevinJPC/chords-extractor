import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createAudioAnalysisJob, getAudioAnalysisJob } from '../services/audioAnalyses'
import { AudioCard } from './AudioCard'
import './SearchListResults.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Spinner } from './Spinner'
import { useLocation } from 'wouter'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ConditionalLink } from './ConditionalLink'
import { AUDIO_ANALYSIS_STATUS } from '../../../constants/audioAnalisesStatus.js'
import { queryClient } from '../config/queryClient.js'

const SearchListResultsContext = createContext()

export const SearchListResults = ({ children, ...props }) => {
  const [selectedResultId, setSelectedResultId] = useState(null)
  const [, navigate] = useLocation()

  const { isSuccess: mutationIsSuccess, isPending: mutationIsPending, data: mutationData, error: mutationError, mutate: runAudioAnalysisJobMutation } = useMutation({
    mutationKey: ['job'],
    mutationFn: createAudioAnalysisJob
  })
  const { data: queryData, error: queryError } = useQuery({
    queryKey: ['job'],
    queryFn: () => getAudioAnalysisJob({ jobId: mutationData.id }),
    enabled: mutationIsSuccess && mutationData?.id !== null && ['waiting', 'processing'].includes(mutationData?.status),
    refetchInterval: (query) => {
      if (['waiting', 'processing'].includes(query.state.data?.status)) return 1000
      return false
    },
    refetchOnWindowFocus: false
  })

  const { jobResult, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted } = useMemo(() => {
    const job = mutationData !== undefined || queryData !== undefined ? { ...mutationData, ...queryData } : undefined
    const jobIsError = mutationError !== null || queryError !== null || job?.status === 'error'
    const jobIsInQueue = job?.status === AUDIO_ANALYSIS_STATUS.waiting
    const jobIsProcessing = job?.status === AUDIO_ANALYSIS_STATUS.processing
    const jobIsCompleted = job?.status === AUDIO_ANALYSIS_STATUS.completed
    return { jobResult: job?.result, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted }
  }, [mutationData, queryData, mutationError, queryError])

  useEffect(() => {
    if (!jobIsCompleted) return
    const timeoutId = setTimeout(() => {
      navigate(`chords/${jobResult._id}`)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [jobIsCompleted])

  const analyze = ({ youtubeId }) => {
    if (selectedResultId && !jobIsError) return
    queryClient.resetQueries({ queryKey: 'job', exact: true })
    setSelectedResultId(youtubeId)
    runAudioAnalysisJobMutation({ youtubeId })
  }

  return (
    <SearchListResultsContext.Provider value={{ selectedResultId, analyze, mutationIsPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted }}>
      {children}
    </SearchListResultsContext.Provider>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const { selectedResultId, analyze, mutationIsPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted } = useContext(SearchListResultsContext)

  const isSelectedResult = selectedResultId === youtubeId

  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isSelectedResult || mutationIsPending || jobIsError)
  const buttonContent = isSelectedResult && mutationIsPending ? <Spinner size={14} /> : 'Analyze now'
  const showStatus = !isSelectedResult || mutationIsPending || jobIsError

  const audioCardClassName = (selectedResultId !== null && !isSelectedResult && !jobIsError) ? 'results-item--disabled' : ''

  const bpm = Math.round(audioAnalysis?.bpm)

  return (
    <ConditionalLink to={`chords/${audioAnalysis?._id}`} navigable={isAnalyzed === true}>
      <AudioCard className={`results-item ${audioCardClassName}`}>
        <AudioCard.Thumbnail>
          <AudioCard.ThumbnailImg src={thumbnails[0].url} />
        </AudioCard.Thumbnail>
        <AudioCard.Content>
          <AudioCard.Title>{title}</AudioCard.Title>
          <AudioCard.Body>

            {showDetailList && (
              <AudioCard.DetailsList>
                <AudioCard.DetailsItem>{12} edits</AudioCard.DetailsItem>
                <AudioCard.DetailsItem>{12} views</AudioCard.DetailsItem>
                {audioAnalysis && <AudioCard.DetailsItem> {bpm} bpm</AudioCard.DetailsItem>}
              </AudioCard.DetailsList>
            )}

            {showButton && (
              <AudioCard.Button onClick={() => analyze({ youtubeId })}>
                {buttonContent}
              </AudioCard.Button>
            )}
            {isSelectedResult
              ? (
                <>
                  {jobIsError && 'An error happend, try again.'}
                  {jobIsInQueue && 'waiting in queue'}
                  {jobIsProcessing && 'processing'}
                  {jobIsCompleted && 'redirecting'}
                </>
                )
              : null}

            {showStatus && <AudioCard.Status isAnalyzed={isAnalyzed} />}

          </AudioCard.Body>
        </AudioCard.Content>
      </AudioCard>
    </ConditionalLink>

  )
}

SearchListResults.ItemSkeleton = () =>
  <SkeletonTheme baseColor='#222' highlightColor='#444'>
    <AudioCard>
      <AudioCard.Thumbnail>
        <Skeleton height='100%' width='100%' />
      </AudioCard.Thumbnail>
      <AudioCard.Content>
        <AudioCard.Title><Skeleton /></AudioCard.Title>
        <AudioCard.Body>
          <Skeleton width='100px' height='30px' />
        </AudioCard.Body>
      </AudioCard.Content>
    </AudioCard>
  </SkeletonTheme>
