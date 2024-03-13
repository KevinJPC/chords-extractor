import { createContext, useContext, useEffect, useState } from 'react'
import { AudioCard } from './AudioCard'
import './SearchListResults.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Spinner } from './Spinner'
import { useLocation } from 'wouter'
import { ConditionalLink } from './ConditionalLink'
import { toast } from 'react-hot-toast'
import { CustomContent } from './Toaster.jsx'
import { useCreateAudioAnalysisJobPolling } from '../hooks/useCreateAudioAnalysisJobPolling.js'
import { useUpdateSearchQueryData } from '../hooks/useUpdateSearchQueryData.js'

const SearchListResultsContext = createContext({
  selectedResultId: null
})

export const SearchListResults = ({ children, ...props }) => {
  const [selectedResultId, setSelectedResultId] = useState(null)
  const { updateResult } = useUpdateSearchQueryData()
  const [, navigate] = useLocation()

  const { error, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, jobResult, createJob, isPending } = useCreateAudioAnalysisJobPolling()

  useEffect(() => {
    if (!(jobIsError || error)) return
    toast.error(<CustomContent>Ha ocurrido un error</CustomContent>, {
      id: 'job',
      duration: Infinity
    })
    return () => toast.dismiss('job')
  }, [jobIsError, error])

  useEffect(() => {
    if (!jobIsCompleted) return

    updateResult({
      youtubeId: jobResult.youtubeId,
      data: {
        isAnalyzed: true,
        audioAnalysis: {
          _id: jobResult._id,
          edits: jobResult.edits,
          bpm: jobResult.bpm
        }
      }
    })

    const timeoutId = setTimeout(() => {
      navigate(`chords/${jobResult._id}`)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [jobIsCompleted])

  const analyze = ({ youtubeId }) => {
    if (selectedResultId && !(jobIsError || error)) return
    toast.dismiss('job')
    if (youtubeId !== selectedResultId) setSelectedResultId(youtubeId)
    createJob({ youtubeId })
  }

  return (
    <SearchListResultsContext.Provider value={{ selectedResultId, analyze, isPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, error }}>
      {children}
    </SearchListResultsContext.Provider>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const { selectedResultId, analyze, isPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, error } = useContext(SearchListResultsContext)

  const isSelectedResult = selectedResultId !== null && selectedResultId === youtubeId
  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isSelectedResult || isPending || (jobIsError || error))
  const showJobStatus = isSelectedResult && !isPending && !(jobIsError || error)
  const buttonContent = isSelectedResult && isPending ? <Spinner size={14} /> : 'Analyze now'
  const showStatus = !isSelectedResult || isPending || (jobIsError || error)
  const disableItem = selectedResultId !== null && !isSelectedResult && (!(jobIsError || error) || jobIsCompleted)
  const isSelected = selectedResultId !== null && isSelectedResult && !(jobIsError || error)

  const bpm = Math.round(audioAnalysis?.bpm)

  return (
    <ConditionalLink to={`chords/${audioAnalysis?._id}`} isNavigable={isAnalyzed && !disableItem}>
      <AudioCard isDisabled={disableItem} isSelected={isSelected}>
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

            {showJobStatus &&
              <AudioCard.JobStatus
                jobIsCompleted={jobIsCompleted}
                jobIsProcessing={jobIsProcessing}
                jobIsInQueue={jobIsInQueue}
              />}

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
