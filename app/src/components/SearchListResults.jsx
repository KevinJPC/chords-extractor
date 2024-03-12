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
import { toast } from 'react-hot-toast'
import { CustomContent } from './Toaster.jsx'
import { useQueryParams } from '../hooks/useQueryParams.js'

const SearchListResultsContext = createContext({
  selectedResultId: null
})

const useCreateAudioAnalysisJobPolling = () => {
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

  const { jobResult, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, error } = useMemo(() => {
    const job = mutationData !== undefined || queryData !== undefined ? { ...mutationData, ...queryData } : undefined
    const jobIsError = job?.status === 'error'
    const jobIsInQueue = job?.status === AUDIO_ANALYSIS_STATUS.waiting
    const jobIsProcessing = job?.status === AUDIO_ANALYSIS_STATUS.processing
    const jobIsCompleted = job?.status === AUDIO_ANALYSIS_STATUS.completed
    const error = mutationError !== null || queryError !== null ? { ...mutationError, ...queryError } : null
    return { jobResult: job?.result, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, error }
  }, [mutationData, queryData, mutationError, queryError])

  const runAudioAnalysisJobMutation = ({ youtubeId }) => {
    queryClient.resetQueries({ queryKey: 'job', exact: true }) // reset job query data
    mutate({ youtubeId })
  }

  return { jobResult, jobIsError, jobIsInQueue, jobIsCompleted, jobIsProcessing, error, createJob: runAudioAnalysisJobMutation, isPending: mutationIsPending }
}

export const SearchListResults = ({ children, ...props }) => {
  const [selectedResultId, setSelectedResultId] = useState(null)
  const { updateResult } = useUpdateSearchQueryData()
  const [, navigate] = useLocation()

  const { error, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, jobResult, createJob, isPending } = useCreateAudioAnalysisJobPolling()

  useEffect(() => {
    return () => toast.dismiss('job')
  }, [])

  useEffect(() => {
    if (!(jobIsError || error)) return
    toast.error(<CustomContent>Ha ocurrido un error</CustomContent>, {
      id: 'job',
      duration: Infinity
    })
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

const FakeProgressBar = ({ hasFinished = false }) => {
  const [fakeProgress, setFakeProgress] = useState(0)
  const value = hasFinished ? 100 : fakeProgress

  useEffect(() => {
    const stepValueRandom = Math.floor(Math.random() * 10) + 1

    if (hasFinished) return
    const timeoutId = setTimeout(function increaseProgress () {
      const currentProgress = fakeProgress
      if (currentProgress >= 90) return
      setFakeProgress(currentProgress + stepValueRandom)
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [fakeProgress])

  return (
    <div>
      <label htmlFor='progress'>Progress {value}%</label>
      <progress id='progress' className='progress' max={100} value={value} />
    </div>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const { selectedResultId, analyze, isPending, jobIsError, jobIsInQueue, jobIsProcessing, jobIsCompleted, error } = useContext(SearchListResultsContext)

  const isSelectedResult = selectedResultId !== null && selectedResultId === youtubeId
  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isSelectedResult || isPending || (jobIsError || error))
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
            {isSelectedResult
              ? (
                <>
                  {jobIsInQueue && 'waiting in queue'}
                  {(jobIsProcessing || jobIsCompleted) && <FakeProgressBar hasFinished={jobIsCompleted} />}
                  {/* {jobIsCompleted && 'redirecting'} */}
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

const useUpdateSearchQueryData = () => {
  const [{ q }] = useQueryParams()

  const updateResult = ({ youtubeId, data }) => {
    const searchData = queryClient.getQueryData(['search', q])

    for (let pageIndex = 0; pageIndex < searchData.pages.length; pageIndex++) {
      for (let resultIndex = 0; resultIndex < searchData.pages[pageIndex].results.length; resultIndex++) {
        const result = searchData.pages[pageIndex].results[resultIndex]
        if (result.youtubeId === youtubeId) {
          searchData.pages[pageIndex].results[resultIndex] = {
            ...result,
            ...data
          }
          return
        }
      }
    }
  }
  return { updateResult }
}
