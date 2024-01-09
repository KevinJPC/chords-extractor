import { useEffect, useState } from 'react'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audioAnalyses'
import { Link } from 'wouter'

export const Home = () => {
  const [searchResult, setSearchResult] = useState(null)

  const fetchAllAudioAnalysisByYoutubeSearch = async ({ searchQuery, continuation }) => {
    try {
      const data = await getAllAudioAnalysesByYoutubeSearch({ searchQuery, continuation })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { search } = Array.from(formData).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    const result = await fetchAllAudioAnalysisByYoutubeSearch({ searchQuery: search })
    setSearchResult(result)
  }

  const handleClick = async () => {
    const { continuation } = searchResult
    const result = await fetchAllAudioAnalysisByYoutubeSearch({ continuation })
    const newResults = [...searchResult.results, ...result.results]
    setSearchResult({ results: newResults, continuation: result.continuation })
  }

  useEffect(() => {

    //
  }, [])
  return (
    <>
      <h1>
        Chords extractor
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Search
          <input name='search' type='text' placeholder='Type a title or paste a link' />
        </label>

        <button type='submit'>Search</button>
      </form>

      <ul>
        {
          searchResult?.results.map(
            ({ id, title, audioAnalysisId }) =>
              <li key={id}>
                <h1>{title} - {id}</h1>
                <span>{audioAnalysisId ? 'Analyzed' : 'Not analyzed'}</span>
                {audioAnalysisId && <Link href={`/chords/${audioAnalysisId}`}><a>Button</a></Link>}
              </li>
          )
        }
      </ul>
      <button onClick={handleClick}>Load more</button>
    </>
  )
}
