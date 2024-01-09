const API_URL = 'http://localhost:3000/api'

export const getAudioInfo = async ({ id }) => {
  try {
    console.log('id', id)
    const endpoint = `${API_URL}/audio-analyses/${id}`
    const res = await fetch(endpoint)
    const { chords, bpm, beatTimes } = JSON.parse(res)
    return { chords, bpm, beatTimes }
  } catch (error) {
    console.log('service', error)
  }
}

export const getAllAudioAnalysesByYoutubeSearch = async ({ searchQuery }) => {
  const endpoint = `${API_URL}/audio-analyses?source=youtube&searchQuery=${searchQuery}`
  const res = await fetch(endpoint)
  const { data } = await res.json()
  console.log(data)
  return data
}
