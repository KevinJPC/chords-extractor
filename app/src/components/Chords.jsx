import { useMemo } from 'react'
import './Chords.css'

export const Chords = ({ bpm, beats, chordsPerBeats, currentTime, ...props }) => {
  const barsNum = 4

  const chordsAndBeatsPerBars = useMemo(() => {
    const bars = []
    for (let index = 0; index < beats.length; index++) {
      const currentBarIndex = Math.floor((index / barsNum))
      const bar = bars[currentBarIndex] || []

      const beat = beats[index]
      const chord = chordsPerBeats[index]
      const currentBeatAndChord = { ...beat, chord }

      bars[currentBarIndex] = [...bar, currentBeatAndChord]
    }
    return bars
  }, [])

  return (
    <>
      <ul className='bars-list'>
        {
          chordsAndBeatsPerBars?.map((bar, index) => {
            return (
              <li key={index} className='bars-list__item'>
                <ul className='chords-list'>
                  {
                  bar?.map(({ startTime, endTime, chord }, beatTimeIndex) => {
                    const isCurrentBeatTime = startTime <= currentTime && currentTime < endTime
                    return (
                      <li key={startTime} className='chords-list__list-item'>
                        <div className='chord' style={{ background: isCurrentBeatTime ? 'Cyan' : 'transparent' }}>
                          {chord}
                        </div>
                      </li>
                    )
                  }
                  )
                  }
                </ul>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}
