import { createContext, useContext } from 'react'
import { AudioCard } from './AudioCard'
import 'react-loading-skeleton/dist/skeleton.css'
import { Spinner } from './Spinner'
import { useAnalyzeResults } from '../hooks/useAnalyzeResults'

const SearchListResultsContext = createContext({
  selectedResultId: null
})

const SearchListResultsProvider = ({ children }) => {
  const {
    selectedResultId,
    analyze,
    jobCreationIsPending,
    jobIsCompleted,
    jobIsInQueue,
    jobIsProcessing,
    jobIsFailed,
    error
  } = useAnalyzeResults()
  return (
    <SearchListResultsContext.Provider value={{
      selectedResultId,
      analyze,
      jobCreationIsPending,
      jobIsFailed,
      jobIsInQueue,
      jobIsProcessing,
      jobIsCompleted,
      error
    }}
    >
      {children}
    </SearchListResultsContext.Provider>
  )
}

export const SearchListResults = ({ children, ...props }) => {
  return (
    <SearchListResultsProvider>
      {children}
    </SearchListResultsProvider>
  )
}

SearchListResults.Item = ({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) => {
  const {
    selectedResultId,
    analyze,
    jobCreationIsPending,
    jobIsFailed,
    jobIsInQueue,
    jobIsProcessing,
    jobIsCompleted,
    error
  } = useContext(SearchListResultsContext)

  const isSelectedResultId = selectedResultId === youtubeId

  const bodyContent = (() => {
    if (isAnalyzed) {
      const bpm = Math.round(audioAnalysis?.bpm)
      return (
        <>
          <AudioCard.DetailsList>
            <AudioCard.DetailsItem>{12} edits</AudioCard.DetailsItem>
            <AudioCard.DetailsItem>{12} views</AudioCard.DetailsItem>
            <AudioCard.DetailsItem>{bpm} bpm</AudioCard.DetailsItem>
          </AudioCard.DetailsList>
          <AudioCard.Status isAnalyzed />
        </>
      )
    }
    if (isSelectedResultId && !jobCreationIsPending && !jobIsFailed && !error) {
      return (
        <AudioCard.JobStatus
          isCompleted={jobIsCompleted}
          isProcessing={jobIsProcessing}
          isInQueue={jobIsInQueue}
        />
      )
    }

    const buttonContent = selectedResultId === youtubeId && jobCreationIsPending ? <Spinner size={14} /> : 'Analyze now'
    return (
      <>
        <AudioCard.Button onClick={() => analyze({ youtubeId })}>
          {buttonContent}
        </AudioCard.Button>
        <AudioCard.Status isAnalyzed={false} />
      </>
    )
  })()

  const isDisabled = selectedResultId && !isSelectedResultId && !jobIsFailed && !error
  const isSelected = isSelectedResultId && !jobIsFailed && !error

  return (

    <AudioCard
      isSelected={isSelected}
      isDisabled={isDisabled}
      isNavigable={isAnalyzed}
      to={`chords/${audioAnalysis?._id}`}
    >
      <AudioCard.Thumbnail>
        <AudioCard.ThumbnailImg src={thumbnails[0].url} />
      </AudioCard.Thumbnail>
      <AudioCard.Content>
        <AudioCard.Title>
          {title}
        </AudioCard.Title>
        <AudioCard.Body>
          {bodyContent}
        </AudioCard.Body>
      </AudioCard.Content>
    </AudioCard>
  )
}
