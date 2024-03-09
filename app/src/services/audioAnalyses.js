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

const delay = async (time = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time)
  })
}

export const createAudioAnalysisJob = async ({ youtubeId }) => {
  const endpoint = new URL(`${API_URL}/audio-analyses/job`)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      youtubeId
    })
  })
  const { data } = await res.json()
  return { id: data.id, status: data.status, result: data.result }
}

export const getAudioAnalysisJob = async ({ jobId }) => {
  // await delay(1000)
  const endpoint = new URL(`${API_URL}/audio-analyses/job/${jobId}`)
  const res = await fetch(endpoint)
  const { data } = await res.json()
  return { id: data.id, status: data.status, result: data.result }
}
