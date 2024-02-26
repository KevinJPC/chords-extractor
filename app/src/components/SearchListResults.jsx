import { useEffect, useState } from 'react'
import { createAudioAnalysis } from '../services/audioAnalyses'
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

export const SearchListResultsItem = ({ _id, youtubeId, thumbnails, title, views, edits, isAnalyzing, analysisStatus, updateAnalyzingId }) => {
  const isAnalyzed = _id !== undefined

  const showStatus = !isAnalyzing || analysisStatus === ANALYSIS_STATUS.starting
  const isInQueue = isAnalyzing && analysisStatus === ANALYSIS_STATUS.queue
  const isProcessing = isAnalyzing && analysisStatus === ANALYSIS_STATUS.processing
  const hasSucceded = isAnalyzing && analysisStatus === ANALYSIS_STATUS.success
  const showDetailList = isAnalyzed
  const showButton = !isAnalyzed && (!isAnalyzing || analysisStatus === ANALYSIS_STATUS.starting)
  const buttonContent = isAnalyzing && analysisStatus === ANALYSIS_STATUS.starting ? <Spinner size={14} /> : 'Analyze now'

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
              <AudioCard.DetailsItem>{edits} edits</AudioCard.DetailsItem>
              <AudioCard.DetailsItem>{views} views</AudioCard.DetailsItem>
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

export const SearchListResults = ({ results, ...props }) => {
  const [youtubeIdAnalyzing, setYoutubeIdAnalyzing] = useState(null)
  const [analysisStatus, setAnalysisStatus] = useState(null)

  const updateAnalyzingId = ({ youtubeId }) => {
    if (youtubeIdAnalyzing !== null) return
    setYoutubeIdAnalyzing(youtubeId)
    setAnalysisStatus(ANALYSIS_STATUS.starting)
  }

  const onQueue = () => {
    console.log('in queue')
    setAnalysisStatus(ANALYSIS_STATUS.queue)
  }

  const onProcess = () => {
    console.log('in process')
    setAnalysisStatus(ANALYSIS_STATUS.processing)
  }

  const onSuccess = (data) => {
    // const id = data.
    console.log('success')
    setAnalysisStatus(ANALYSIS_STATUS.success)
    setTimeout(() => {
      console.log('navigating')
      // navigate(`chords/${_id}`)
    }, 1000)
  }

  useEffect(() => {
    if (youtubeIdAnalyzing === null) return
    console.log('creating')
    const { closeSource } = createAudioAnalysis({ youtubeId: youtubeIdAnalyzing, onQueue, onProcess, onSuccess })
    return () => {
      closeSource()
    }
  }, [youtubeIdAnalyzing])

  ///

  const [, navigate] = useLocation()

  const handleOnNavigate = ({ _id }) => {
    if (youtubeIdAnalyzing !== null || _id === undefined) return
    console.log('navigating')
    // navigate(`chords/${youtubeId}`)
  }

  return (
    <ul className='search-list-results' {...props}>
      {results.map(({ _id, youtubeId, title, thumbnails, edits }) => {
        const isAnalyzing = youtubeIdAnalyzing === youtubeId
        const disableItem = youtubeIdAnalyzing !== null && youtubeIdAnalyzing !== youtubeId
        return (
          <li
            key={youtubeId}
            className={
              `search-list-results__item 
              ${disableItem && 'search-list-results__item--disable'}`
            }
            onClick={() => handleOnNavigate({ _id })}
          >
            <SearchListResultsItem
              _id={_id}
              youtubeId={youtubeId}
              thumbnails={thumbnails}
              title={title}
              views={33}
              edits={edits}
              isAnalyzing={isAnalyzing}
              analysisStatus={analysisStatus}
              updateAnalyzingId={updateAnalyzingId}
            />
          </li>
        )
      }
      )}
    </ul>
  )
}

export const SearchListResultsSkeleton = ({ count = 1 }) => {
  return (
    <>
      <SkeletonTheme baseColor='#222' highlightColor='#444'>
        <ul className='search-list-results'>
          {Array(count).fill().map((_, index) => {
            return (
              <li key={index} className='search-list-results__item'>
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
              </li>
            )
          }
          )}
        </ul>
      </SkeletonTheme>
    </>
  )
}
