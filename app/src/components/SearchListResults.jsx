import { createContext, useContext, useEffect, useState } from 'react'
import { createAudioAnalysisJob, getAudioAnalysisJob } from '../services/audioAnalyses'
import { AudioCard } from './AudioCard'
import './SearchListResults.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Spinner } from './Spinner'
import { useLocation } from 'wouter'
import { useMutation, useQuery } from '@tanstack/react-query'

const ANALYSIS_STATUS = {
  starting: 'starting',
  queue: 'queue',
  processing: 'processing',
  success: 'success'
}

const SearchListResultsContext = createContext()

export const SearchListResults = ({ children, ...props }) => {
  const [youtubeIdAnalyzing, setYoutubeIdAnalyzing] = useState(null)

  const { isSuccess: mutationIsSuccess, isPending: mutationIsPending, data: mutationData, error, mutate: runAudioAnalysisJobMutation } = useMutation({
    mutationFn: createAudioAnalysisJob
  })
  const { data: queryData } = useQuery({
    queryKey: ['job'],
    queryFn: () => getAudioAnalysisJob({ jobId: mutationData.id }),
    enabled: mutationIsSuccess && mutationData?.id !== null && ['waiting', 'processing'].includes(mutationData?.status),
    refetchInterval: (query) => {
      // console.log(query)
      if (['waiting', 'processing'].includes(query.state.data?.status)) return 1000
      return false
    }
  })

  const job = mutationData !== undefined || queryData !== undefined ? { ...mutationData, ...queryData } : undefined

  const analyze = ({ youtubeId }) => {
    if (youtubeIdAnalyzing !== null) return
    setYoutubeIdAnalyzing(youtubeId)
    // setAnalysisStatus(ANALYSIS_STATUS.starting)
    runAudioAnalysisJobMutation({ youtubeId })
  }
  ///
  const [, navigate] = useLocation()

  const handleOnNavigate = ({ _id }) => {
    if (youtubeIdAnalyzing !== null || _id === undefined) return
    console.log('navigating')
    // navigate(`chords/${youtubeId}`)
  }
  return (
    <SearchListResultsContext.Provider value={{ youtubeIdAnalyzing, analyze, mutationIsPending, mutationIsSuccess, job }}>
      {children}
    </SearchListResultsContext.Provider>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const { youtubeIdAnalyzing, analyze, mutationIsPending, mutationIsSuccess, job } = useContext(SearchListResultsContext)
  const isAnalyzing = youtubeIdAnalyzing === youtubeId

  const isInQueue = isAnalyzing && (job?.status === 'waiting')
  const isProcessing = isAnalyzing && (job?.status === 'processing')
  const hasSucceded = isAnalyzing && (job?.status === 'completed')
  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isAnalyzing || job === undefined)
  const buttonContent = isAnalyzing && mutationIsPending ? <Spinner size={14} /> : 'Analyze now'
  const showStatus = !isAnalyzing || job === undefined

  return (
    <AudioCard>
      <AudioCard.Thumbnail>
        <AudioCard.ThumbnailImg src={thumbnails[0].url} />
      </AudioCard.Thumbnail>
      <AudioCard.Content>
        <AudioCard.Title>{title}</AudioCard.Title>
        <AudioCard.Body>

          {isInQueue && 'waiting in queue'}
          {isProcessing && 'processing'}
          {hasSucceded && 'redirecting'}

          {showDetailList && (
            <AudioCard.DetailsList>
              <AudioCard.DetailsItem>{12} edits</AudioCard.DetailsItem>
              <AudioCard.DetailsItem>{12} views</AudioCard.DetailsItem>
            </AudioCard.DetailsList>
          )}

          {showButton && (
            <AudioCard.Button onClick={() => analyze({ youtubeId })}>
              {buttonContent}
            </AudioCard.Button>
          )}

          {showStatus && <AudioCard.Status isAnalyzed={isAnalyzed} />}

        </AudioCard.Body>
      </AudioCard.Content>
    </AudioCard>
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
