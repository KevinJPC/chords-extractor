const API_URL = 'http://localhost:3000/api'

export const getAudioAnalysisById = async ({ id }) => {
  try {
    const endpoint = `${API_URL}/audio-analyses/${id}`
    const res = await fetch(endpoint)
    const { data } = await res.json()
    console.log(data)
    return data
  } catch (error) {
    console.log('service', error)
  }
}

export const getAllAudioAnalysesByYoutubeSearch = async ({ searchQuery, continuation }) => {
  let endpoint = `${API_URL}/audio-analyses?source=youtube&searchQuery=${searchQuery}`
  if (continuation) endpoint = endpoint.concat(`&continuation=${continuation}`)
  console.log(continuation)
  const res = await fetch(endpoint)
  const { data } = await res.json()
  console.log(data)
  return data
}
