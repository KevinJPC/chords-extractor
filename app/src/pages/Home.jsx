import { useEffect, useState } from 'react'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audio'
import { Link } from 'wouter'

export const Home = () => {
  const [searchResult, setSearchResult] = useState(null)

  const fetchAllAudioAnalysisByYoutubeSearch = async ({ searchQuery }) => {
    try {
      const data = await getAllAudioAnalysesByYoutubeSearch({ searchQuery })
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
            ({ id, title, isAnalyzed }) =>
              <li key={id}>
                <h1>{title} - {id}</h1>
                <span>{isAnalyzed ? 'Analyzed' : 'Not analyzed'}</span>
                <Link href={`/chords/${id}`}><a>Button</a></Link>
              </li>
          )
        }
      </ul>
    </>
  )
}
