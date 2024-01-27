import './Search.css'
import { useEffect, useState } from 'react'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audioAnalyses'
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
      data?.results.map(({ _id, youtubeId, title, thumbnails, edits, chordsPerBeats }) =>
        <li key={youtubeId}>
          <AudioCard
            _id={_id}
            title={title}
            youtubeId={youtubeId}
            thumbnail={thumbnails[0].url}
            edits={edits}
            chordsPerBeats={chordsPerBeats}
          />
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
