import './Search.css'
import { useEffect, useState } from 'react'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audioAnalyses'
import { getQueryParams, useRoute } from '../hooks/wouterWrapper'
import { AudioCard } from '../components/AudioCard'

export const Search = () => {
  const { q } = getQueryParams()

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
    fetchAllAudioAnalysisByYoutubeSearch({ searchQuery: q })
  }, [])

  // const handleClick = async () => {
  //   const { continuation } = searchResult
  //   const result = await fetchAllAudioAnalysisByYoutubeSearch({ continuation })
  //   const newResults = [...searchResult.results, ...result.results]
  //   setSearchResult({ results: newResults, continuation: result.continuation })
  // }

  return (
    <section className='container'>
      {data?.results.length > 0 &&
        <ul className='list'>
          {data?.results.map(({ _id, youtubeId, title, thumbnails, edits, chordsPerBeats }) => {
            const isAnalyzed = _id !== undefined
            return (
              <li key={youtubeId}>
                <AudioCard>
                  <AudioCard.Thumbnail src={thumbnails[0].url} />
                  <AudioCard.Content>
                    <AudioCard.Title>
                      {title}
                    </AudioCard.Title>
                    <AudioCard.Body>
                      {!isAnalyzed && <AudioCard.Button>Analyze now</AudioCard.Button>}
                      {isAnalyzed && (
                        <AudioCard.Details>
                          <AudioCard.Detail>{edits} edits</AudioCard.Detail>
                          <AudioCard.Detail>{33} visits</AudioCard.Detail>
                        </AudioCard.Details>
                      )}
                      <AudioCard.Status isAnalyzed={isAnalyzed} />
                    </AudioCard.Body>
                  </AudioCard.Content>
                </AudioCard>
              </li>
            )
          }

          )}
        </ul>}

    </section>
  )
}
