import { useMemo } from 'react'
import './AudioCard.css'
import { chordParserFactory, chordRendererFactory } from 'chord-symbol/lib/chord-symbol.js'

// const CHORDS_PARSER_OPTIONS = {
//   useShortNamings: true,
//   simplify: 'none', // none | max | core,
//   transposeValue: 0,
//   accidental: 'origianal', // original | flat | sharp
//   notationSystem: 'english'
// }

// const parseChord = useMemo(() => chordParserFactory(), [])
// const renderChord = useMemo(() => chordRendererFactory(CHORDS_PARSER_OPTIONS), [])

// console.log(chordsPerBeats)
// const chordsSymbol = chordsPerBeats?.map((chord) => {
//   const chordsParsed = parseChord(chord)
//   return renderChord(chordsParsed)
// })

export const AudioCard = ({ _id, youtubeId, title, thumbnail, edits, props, chordsPerBeats }) => {
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
        <div className='audio-card__details'>
          {
          isAnalyzed
            ? (
              <>
                <ul className='audio-card__list'>
                  <li className='audio-card__list-item'>
                    {33} visits
                  </li>
                  <li className='audio-card__list-item'>
                    {edits} edits
                  </li>
                </ul>
              </>
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

      </div>
    </article>
  )
}
