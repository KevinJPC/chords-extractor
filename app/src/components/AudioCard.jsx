import './AudioCard.css'
import { Children } from 'react'

export const AudioCard = ({ children, className = '', ...props }) => {
  return (
    <article className={`audio-card ${className}`} {...props}>
      {children}
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

AudioCard.ThumbnailImg = ({ src, props }) => {
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
    <h1 className='audio-card__title'>{children}</h1>
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
  const statusText = isAnalyzed ? 'analyzed' : 'not analyzed'
  const statusClass = isAnalyzed ? 'audio-card__status--analyzed' : 'audio-card__status--not-analyzed'
  return (
    <footer className={`audio-card__status ${statusClass}`} {...props}>
      {statusText}
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
//

// import { chordParserFactory, chordRendererFactory } from 'chord-symbol/lib/chord-symbol.js'
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
