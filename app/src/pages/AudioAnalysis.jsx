import { useEffect, useState } from 'react'
import { getAudioAnalysisById } from '../services/audioAnalyses'

export const AudioAnalysis = ({ params }) => {
  const [audioAnalysis, setAudioAnalysis] = useState(null)
  const { id } = params
  const fetchAudioAnalysis = async ({ id }) => {
    const data = await getAudioAnalysisById({ id })
    setAudioAnalysis(data)
  }

  useEffect(() => {
    fetchAudioAnalysis({ id })
  }, [])

  return (
    <h1>{audioAnalysis?.title}</h1>
  )
}
