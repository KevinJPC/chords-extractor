import { createContext, useContext, useState } from 'react'
import { createAudioAnalysisJob, getAudioAnalysisJob } from '../services/audioAnalyses'
import { AudioCard } from './AudioCard'
import './SearchListResults.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Spinner } from './Spinner'
import { useLocation } from 'wouter'

const ANALYSIS_STATUS = {
  starting: 'starting',
  queue: 'queue',
  processing: 'processing',
  success: 'success'
}

const SearchListResultsContext = createContext()

export const SearchListResults = ({ children, ...props }) => {
  const [youtubeIdAnalyzing, setYoutubeIdAnalyzing] = useState(null)
  const [analysisStatus, setAnalysisStatus] = useState(null)

  const updateAnalyzingId = ({ youtubeId }) => {
    // if (youtubeIdAnalyzing !== null) return
    // setYoutubeIdAnalyzing(youtubeId)
    // setAnalysisStatus(ANALYSIS_STATUS.starting)
  }
  ///
  const [, navigate] = useLocation()

  const handleOnNavigate = ({ _id }) => {
    if (youtubeIdAnalyzing !== null || _id === undefined) return
    console.log('navigating')
    // navigate(`chords/${youtubeId}`)
  }
  return (
    <SearchListResultsContext.Provider value={{ youtubeIdAnalyzing, updateAnalyzingId, analysisStatus }}>
      {children}
    </SearchListResultsContext.Provider>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const { youtubeIdAnalyzing, updateAnalyzingId, analysisStatus } = useContext(SearchListResultsContext)
  const isAnalyzing = youtubeIdAnalyzing === youtubeId

  const showStatus = !isAnalyzing || analysisStatus === ANALYSIS_STATUS.starting
  const isInQueue = isAnalyzing && analysisStatus === ANALYSIS_STATUS.queue
  const isProcessing = isAnalyzing && analysisStatus === ANALYSIS_STATUS.processing
  const hasSucceded = isAnalyzing && analysisStatus === ANALYSIS_STATUS.success
  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isAnalyzing || analysisStatus === ANALYSIS_STATUS.starting)
  const buttonContent = isAnalyzing && analysisStatus === ANALYSIS_STATUS.starting ? <Spinner size={14} /> : 'Analyze now'

  // const showStatus = true
  // const isInQueue = false
  // const isProcessing = false
  // const hasSucceded = false
  // const showDetailList = isAnalyzed
  // const showButton = true
  // const buttonContent = 'Analyze now'

  const handleOnAnalyze = ({ youtubeId }) => {
    updateAnalyzingId({ youtubeId })
  }

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
            <AudioCard.Button onClick={() => handleOnAnalyze({ youtubeId })}>
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
