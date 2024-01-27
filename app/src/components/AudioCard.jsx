import './AudioCard.css'

export const AudioCard = ({ title, thumbnail, originalAudioAnalysisId, props }) => {
  return (
    <article className='audio-card'>
      <figure className='audio-card__figure'>
        <img src={thumbnail} className='audio-card__img' />
      </figure>
      <div className='audio--card__info'>
        <h1 className='audio-card__title'>{title}</h1>
        <p className='audio-card__detail'>12 edits</p>
        <footer className='audio-card__footer'>
          <p>
            {originalAudioAnalysisId ? 'analyzed' : 'not analyzed'}
          </p>
        </footer>
      </div>
    </article>
  )
}
