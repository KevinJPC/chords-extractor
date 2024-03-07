import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createAudioAnalysisJob, getAudioAnalysisJob } from '../services/audioAnalyses'
import { AudioCard } from './AudioCard'
import './SearchListResults.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Spinner } from './Spinner'
import { Link, useLocation } from 'wouter'
import { useMutation, useQuery } from '@tanstack/react-query'

const ANALYSIS_STATUS = {
  starting: 'starting',
  queue: 'queue',
  processing: 'processing',
  success: 'success'
}

const SearchListResultsContext = createContext()

export const SearchListResults = ({ children, ...props }) => {
  const [selectedResultId, setSelectedResultId] = useState(null)
  const [, navigate] = useLocation()

  const { isSuccess: mutationIsSuccess, isPending: mutationIsPending, data: mutationData, error: mutationError, mutate: runAudioAnalysisJobMutation } = useMutation({
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

  const { jobResult, jobIsError, jobIsInQueue, jobIsProcessing, jobIsSuccess } = useMemo(() => {
    const job = mutationData !== undefined || queryData !== undefined ? { ...mutationData, ...queryData } : undefined
    const jobIsError = mutationError !== null || queryError !== null || job?.status === 'error'
    const jobIsInQueue = job?.status === 'waiting'
    const jobIsProcessing = job?.status === 'processing'
    const jobIsSuccess = job?.status === 'completed'
    return { jobResult: job?.result, jobIsError, jobIsInQueue, jobIsProcessing, jobIsSuccess }
  }, [mutationData, queryData, mutationError, queryError])

  useEffect(() => {
    if (!jobIsSuccess) return
    const timeoutId = setTimeout(() => {
      navigate(`chords/${jobResult._id}`)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [jobIsSuccess])

  const analyze = ({ youtubeId }) => {
    console.log(selectedResultId && !jobIsError)
    if (selectedResultId && !jobIsError) return
    setSelectedResultId(youtubeId)
    runAudioAnalysisJobMutation({ youtubeId })
  }

  return (
    <SearchListResultsContext.Provider value={{ selectedResultId, analyze, mutationIsPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsSuccess }}>
      {children}
    </SearchListResultsContext.Provider>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const { selectedResultId, analyze, mutationIsPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsSuccess } = useContext(SearchListResultsContext)

  const isSelectedResult = selectedResultId === youtubeId

  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isSelectedResult || mutationIsPending || jobIsError)
  const buttonContent = isSelectedResult && mutationIsPending ? <Spinner size={14} /> : 'Analyze now'
  const showStatus = !isSelectedResult || mutationIsPending || jobIsError

  const bpm = Math.round(audioAnalysis?.bpm)

  return (
    <Link to={isAnalyzed ? `chords/${audioAnalysis._id}` : ''} replace={isAnalyzed === false}>
      <a>
        <AudioCard>
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

              {isSelectedResult && jobIsError && 'An error happend, try again.'}
              {isSelectedResult && jobIsInQueue && 'waiting in queue'}
              {isSelectedResult && jobIsProcessing && 'processing'}
              {isSelectedResult && jobIsSuccess && 'redirecting'}

              {showStatus && <AudioCard.Status isAnalyzed={isAnalyzed} />}

            </AudioCard.Body>
          </AudioCard.Content>
        </AudioCard>
      </a>
    </Link>
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
