import './AudioCard.css'
import { Children } from 'react'
import { FakeProgressBar } from './FakeProgressBar'
import { ConditionalLink } from './ConditionalLink'

export const AudioCard = ({ children, isDisabled = false, isSelected = false, isNavigable = false, to, ...props }) => {
  return (
    <article
      className={`audio-card ${isDisabled ? 'audio-card--disabled' : ''} ${isSelected ? 'audio-card--selected' : ''}`}
      {...props}
    >
      <ConditionalLink isNavigable={isNavigable} to={to}>
        <div className='audio-card__container'>
          {children}
        </div>
      </ConditionalLink>
    </article>
  )
}

AudioCard.Thumbnail = ({ children, ...props }) => {
  return (
    <picture className='audio-card__thumbnail' {...props}>
      {children}
    </picture>
  )
}

AudioCard.ThumbnailImg = ({ src, ...props }) => {
  return (
    <img src={src} className='audio-card__img' />
  )
}

AudioCard.Content = ({ children, ...props }) => {
  return (
    <div className='audio-card__content' {...props}>
      {children}
    </div>
  )
}

AudioCard.Title = ({ children, ...props }) => {
  return (
    <h1 className='audio-card__title'>
      {children}
    </h1>
  )
}

AudioCard.Body = ({ children, ...props }) => {
  return (
    <div className='audio-card__body' {...props}>
      {children}
    </div>
  )
}

AudioCard.DetailsList = ({ children, ...props }) => {
  return (
    <ul className='audio-card__details' {...props}>
      {
        Children.toArray(children).map((child, index) =>
          <li key={index} className='audio-card__detail'>
            {child}
          </li>)
      }
    </ul>
  )
}

AudioCard.DetailsItem = ({ children }) => {
  return (
    <>
      {children}
    </>
  )
}

AudioCard.Status = ({ isAnalyzed, ...props }) => {
  const statusText = isAnalyzed ? 'Analyzed' : 'Not analyzed'
  const statusClass = isAnalyzed ? 'audio-card__status--analyzed' : 'audio-card__status--not-analyzed'
  return (
    <footer className={`audio-card__status ${statusClass}`} {...props}>
      <span>
        {statusText}
      </span>
    </footer>
  )
}

AudioCard.Button = ({ children, ...props }) => {
  return (
    <button type='submit' className='audio-card__analyze-button' {...props}>
      {children}
    </button>
  )
}

AudioCard.JobStatus = ({ isProcessing, isCompleted, isInQueue }) => {
  const jobStatusText = (() => {
    if (isCompleted) return 'Redirecting'
    if (isProcessing) return 'Processing'
    if (isInQueue) return 'Waiting in queue'
  })()

  const showProgressBar = isProcessing || isCompleted

  return (
    <div className='audio-card__job-status'>
      {showProgressBar && <FakeProgressBar hasFinished={isCompleted} />}
      <span className='audio-card__job-status-text'>{jobStatusText}</span>
    </div>
  )
}
