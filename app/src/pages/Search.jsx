import './Search.css'
import { useEffect, useState } from 'react'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audioAnalyses'
import { Link } from 'wouter'
import { useRoute } from '../hooks/wouterWrapper'
import { AudioCard } from '../components/AudioCard'

export const Search = () => {
  const [match, { q: search }] = useRoute('/search')

  const [data, setData] = useState(null)

  const fetchAllAudioAnalysisByYoutubeSearch = async ({ searchQuery, continuation }) => {
    try {
      const data = await getAllAudioAnalysesByYoutubeSearch({ searchQuery, continuation })
      console.log(data)
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllAudioAnalysisByYoutubeSearch({ searchQuery: search })
  }, [])

  // const handleClick = async () => {
  //   const { continuation } = searchResult
  //   const result = await fetchAllAudioAnalysisByYoutubeSearch({ continuation })
  //   const newResults = [...searchResult.results, ...result.results]
  //   setSearchResult({ results: newResults, continuation: result.continuation })
  // }

  return (
    <div className='container'>
      <ul className='list'>
        {
      data?.results.map(({ id, title, thumbnails, originalAudioAnalysisId }) =>
        <li key={id}>
          <AudioCard thumbnail={thumbnails[0].url} title={title} originalAudioAnalysisId={originalAudioAnalysisId} />
        </li>
      )
    }
      </ul>

      {
      data?.continuation &&
        <button onClick={() => {}}>Load more</button>
    }
    </div>
  )
}
