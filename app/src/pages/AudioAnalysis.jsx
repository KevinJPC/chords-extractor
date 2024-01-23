import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getAudioAnalysisById } from '../services/audioAnalyses'
import { YoutubePlayer } from '../components/YoutubePlayer'
import { Chords } from '../components/Chords'

export const AudioAnalysis = ({ params }) => {
  const { id } = params

  const [audioAnalysis, setAudioAnalysis] = useState(null)

  const [currentTime, setCurrentTime] = useState(0)

  const [hideVideo, setHideVideo] = useState(false)

  const fetchAudioAnalysis = async ({ id }) => {
    const data = await getAudioAnalysisById({ id })
    setAudioAnalysis(data)
  }

  useEffect(() => {
    fetchAudioAnalysis({ id })
  }, [])

  const onTimeUpdate = (time) => {
    setCurrentTime(time)
  }

  const handleChangeToggle = (e) => {
    const hideVideo = e.target.checked
    setHideVideo(hideVideo)
  }

  if (!audioAnalysis) return null

  return (
    <>
      <h1>{audioAnalysis?.title}</h1>

      <div>
        <label>
          Hide video
          <input type='checkbox' onChange={handleChangeToggle} />
        </label>
      </div>

      <YoutubePlayer youtubeId={audioAnalysis.youtubeId} hideVideo={hideVideo} onTimeUpdate={onTimeUpdate} />

      <span>Bpm: {audioAnalysis?.bpm}</span>

      <span>time: {Math.round(currentTime)}</span>

      <Chords bpm={audioAnalysis.bpm} beats={audioAnalysis.beats} chordsPerBeats={audioAnalysis.chordsPerBeats} currentTime={currentTime} />

    </>

  )
}
