import './AudioCard.css'
import { chordParserFactory, chordRendererFactory } from 'chord-symbol/lib/chord-symbol.js'

const parseChord = chordParserFactory()
const renderChord = chordRendererFactory()

export const AudioCard = ({ _id, youtubeId, title, thumbnail, edits, props, chordsPerBeats }) => {
  // console.log(chordsPerBeats)

  const chord = parseChord('B/G')
  console.log(chord)
  console.log(renderChord(chord))

  const isAnalyzed = _id !== undefined
  const statusText = isAnalyzed ? 'analyzed' : 'not analyzed'
  const statusClass = isAnalyzed ? 'audio-card__footer--analyzed' : 'audio-card__footer--not-analyzed'
  return (
    <article className='audio-card' {...props}>
      <figure className='audio-card__figure'>
        <img src={thumbnail} className='audio-card__img' />
      </figure>
      <div className='audio-card__info'>
        <h1 className='audio-card__title'>{title}</h1>
        {
          isAnalyzed
            ? (
              <ul className='audio-card__details-list'>
                <li className='audio-card__details-item'>
                  {edits} edits
                </li>
              </ul>
              )
            : (
              <button type='submit' className='audio-card__analyze-button'>
                Analyze now
              </button>
              )
          }
        <footer className={`audio-card__footer ${statusClass}`}>
          {statusText}
        </footer>
      </div>
    </article>
  )
}
