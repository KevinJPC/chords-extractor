const API_URL = 'http://localhost:3000/api'

export const getAudioAnalysisById = async ({ id }) => {
  const endpoint = new URL(`${API_URL}/audio-analyses/${id}`)
  const res = await fetch(endpoint)
  const { data } = await res.json()
  const audioAnalysis = {
    _id: data._id,
    youtubeId: data.youtubeId,
    thumbnails: data.thumbnails,
    duration: data.duration,
    isOriginal: data.isOriginal,
    bpm: data.bpm,
    beats: data.beats,
    chordsPerBeats: data.chordsPerBeats,
    numRatings: data.numRatings,
    totalRating: data.totalRating,
    createdAt: data.createdAt,
    modifiedAt: data.modifiedAt
  }
  console.log(audioAnalysis)
  return audioAnalysis
}

export const getYoutubeResultsWithAnalyzeStatus = async ({ q, continuation }) => {
  const endpoint = new URL(`${API_URL}/audio-analyses/youtube-search`)
  endpoint.searchParams.set('q', q)
  if (continuation) endpoint.searchParams.set('continuation', continuation)
  const res = await fetch(endpoint)
  const { data } = await res.json()
  const mappedResults = data.results.map((result) => ({
    title: result.title,
    youtubeId: result.youtubeId,
    thumbnails: result.thumbnails,
    duration: result.duration,
    isAnalyzed: result.isAnalyzed,
    audioAnalysis: result.audioAnalysis !== null
      ? {
          _id: result.audioAnalysis._id,
          edits: result.audioAnalysis.edits,
          bpm: result.audioAnalysis.bpm
        }
      : null
  }))
  return { results: mappedResults, continuation: data.continuation }
}

export const createAudioAnalysisJob = ({ youtubeId }) => {
  const endpoint = new URL(`${API_URL}/audio-analyses/job`)
}

export const getAudioAnalysisJob = ({ jobId }) => {
  const endpoint = new URL(`${API_URL}/audio-analyses/job/${jobId}`)
}
