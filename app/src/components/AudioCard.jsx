import './AudioCard.css'

export const AudioCard = ({ _id, youtubeId, title, thumbnail, edits, props, chordsPerBeats, children }) => {
  return (
    <article className='audio-card' {...props}>
      {children}
    </article>
  )
}

AudioCard.Thumbnail = ({ src, props }) => {
  return (
    <picture className='audio-card__thumbnail' {...props}>
      <img src={src} className='audio-card__img' />
    </picture>
  )
}

AudioCard.Content = ({ props, children }) => {
  return (
    <div className='audio-card__content'>
      {children}
    </div>
  )
}

AudioCard.Title = ({ props, children }) => {
  return (
    <h1 className='audio-card__title'>{children}</h1>
  )
}

AudioCard.Body = ({ props, children }) => {
  return (
    <div className='audio-card__body'>
      {children}
    </div>
  )
}

AudioCard.Details = ({ props, children }) => {
  return (
    <ul className='audio-card__details'>
      {children}
    </ul>
  )
}

AudioCard.Detail = ({ props, children }) => {
  return (
    <li className='audio-card__detail'>
      {children}
    </li>
  )
}

AudioCard.Status = ({ props, isAnalyzed }) => {
  const statusText = isAnalyzed ? 'analyzed' : 'not analyzed'
  const statusClass = isAnalyzed ? 'audio-card__status--analyzed' : 'audio-card__status--not-analyzed'
  return (
    <footer className={`audio-card__status ${statusClass}`}>
      {statusText}
    </footer>
  )
}

AudioCard.Button = ({ props, children }) => {
  return (
    <button type='submit' className='audio-card__analyze-button'>
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
