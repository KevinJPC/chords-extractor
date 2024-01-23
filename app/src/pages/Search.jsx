import { useState } from 'react'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audioAnalyses'
import { Link } from 'wouter'

export const Search = () => {
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

  return (
    <>
      <ul>
        {
    searchResult?.results.map(
      ({ id, title, originalAudioAnalysisId }) => {
        const isAnalyzed = originalAudioAnalysisId !== undefined
        return (
          <li key={id}>
            <h1>{title} - {id}</h1>
            <span>{isAnalyzed ? 'Analyzed' : 'Not analyzed'}</span>
            {isAnalyzed && <Link href={`/chords/${originalAudioAnalysisId}`}><a>Button</a></Link>}
          </li>
        )
      }
    )
  }
      </ul>

      {
searchResult?.continuation &&
  <button onClick={handleClick}>Load more</button>
}
    </>
  )
}
