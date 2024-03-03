import chordSymbol from 'chord-symbol/lib/chord-symbol.js'

const renderChord = chordSymbol.chordRendererFactory({
  useShortNamings: true,
  simplify: 'none',
  transposeValue: 0,
  accidental: 'original'
})
const parseChord = chordSymbol.chordParserFactory({ notationSystems: ['english'] })

const chordsTest = [null, '', 'G/B', 'Cmaj7', 'Am', 'G']

const formatChords = (chords) => {
  const formattedChords = chords.map((chord) => {
    const chordObj = parseChord(chord)
    const formattedChord = renderChord(chordObj)
    return formattedChord
  })

  return formattedChords
}

const validateAndFormatChords = (chords) => {

}

console.log(formatChords(chordsTest))
