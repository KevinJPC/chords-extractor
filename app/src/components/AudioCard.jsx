import './AudioCard.css'

export const AudioCard = ({ title, thumbnail, originalAudioAnalysisId, edits, props }) => {
  const isAnalyzed = originalAudioAnalysisId !== undefined
  const statusText = isAnalyzed ? 'analyzed' : 'not analyzed'
  const statusClass = isAnalyzed ? 'audio-card__footer--analyzed' : 'audio-card__footer--not-analyzed'
  return (
    <article className='audio-card' {...props}>
      <figure className='audio-card__figure'>
        <img src={thumbnail} className='audio-card__img' />
      </figure>
      <div className='audio-card__info'>
        <h1 className='audio-card__title'>{title}</h1>
        <ul className='audio-card__details-list'>
          <li className='audio-card__details-item'>
            12 edits
          </li>
        </ul>
        <footer className={`audio-card__footer ${statusClass}`}>
          {statusText}
        </footer>
      </div>
    </article>
  )
}
