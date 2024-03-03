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
  const formatedChords = chords.map((chord) => {
    const chordObj = parseChord(chord)
    const formatedChord = renderChord(chordObj)
    return formatedChord
  })

  return formatedChords
}

const validateAndFormatChords = (chords) => {

}

console.log(formatChords(chordsTest))
