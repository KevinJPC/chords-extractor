import chordSymbol from 'chord-symbol/lib/chord-symbol.js'

const { chordParserFactory, chordRendererFactory } = chordSymbol

export const formatChordSymbols = (chordSymbols, { simplify = false, transpose = 0 } = {}) => {
  const parseChord = chordParserFactory({ notationSystems: ['english'] })
  const renderChord = chordRendererFactory({
    useShortNamings: true,
    simplify: simplify === true ? 'max' : 'none',
    transposeValue: transpose
  })
  const formattedChordSymbols = chordSymbols.map((chordSymbol) => {
    const chordObj = parseChord(chordSymbol)
    const formattedChordSymbol = renderChord(chordObj)
    return formattedChordSymbol
  })

  return formattedChordSymbols
}

export const validateAndFormatChordSymbols = (chordSymbols) => {
  const parseChord = chordParserFactory({ notationSystems: ['english'] })
  const renderChord = chordRendererFactory({ useShortNamings: true })
  const formattedChordSymbols = []
  const invalidChordSymbols = new Set()
  for (let chordSymbol of chordSymbols) {
    if (chordSymbol !== null) {
      const chordObj = parseChord(chordSymbol)
      if (chordObj.error !== undefined) invalidChordSymbols.add(chordSymbol)
      chordSymbol = renderChord(chordObj)
    }
    formattedChordSymbols.push(chordSymbol)
  }

  return { invalidChordSymbols: Array.from(invalidChordSymbols), formattedChordSymbols }
}

export const notes = {
  AFlat: 'Ab',
  A: 'A',
  ASharp: 'A#',
  BFlat: 'Bb',
  B: 'B',
  C: 'C',
  CSharp: 'C#',
  DFlat: 'Db',
  D: 'D',
  DSharp: 'D#',
  EFlat: 'Eb',
  E: 'E',
  F: 'F',
  FSharp: 'F#',
  GFlat: 'Gb',
  G: 'G',
  GSharp: 'G#'
}
