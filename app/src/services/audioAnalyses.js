const API_URL = 'http://localhost:3000/api'

export const getAudioAnalysisById = async ({ id }) => {
  const endpoint = `${API_URL}/audio-analyses/${id}`
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

export const getAllAudioAnalysesByYoutubeSearch = async ({ searchQuery, continuation }) => {
  let endpoint = `${API_URL}/audio-analyses?source=youtube&searchQuery=${searchQuery}`
  if (continuation !== undefined) endpoint = endpoint.concat(`&continuation=${continuation}`)
  const res = await fetch(endpoint)
  const { data } = await res.json()
  const mappedResults = data.results.map((audioAnalysis) => ({
    _id: audioAnalysis?._id,
    title: audioAnalysis?.title,
    youtubeId: audioAnalysis?.youtubeId,
    thumbnails: audioAnalysis?.thumbnails,
    duration: audioAnalysis?.duration,
    bpm: audioAnalysis?.bpm,
    chordsPerBeats: audioAnalysis?.chordsPerBeats,
    edits: audioAnalysis?.edits
  }))
  return { results: mappedResults, continuation: data.continuation }
}

export const createAudioAnalysis = async ({ youtubeId }) => {
  const endpoint = `${API_URL}/audio-analyses`
  const data = { youtubeId }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    console.log('Received', value)
  }
}
