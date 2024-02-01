import './Search.css'
import { getAllAudioAnalysesByYoutubeSearch } from '../services/audioAnalyses'
import { useQueryParams } from '../hooks/useQueryParams'
import { SearchListResults, SearchListResultsSkeleton } from '../components/SearchListResults'
import { useInfiniteQuery } from '@tanstack/react-query'
import { InfinityScroll } from '../components/InfiniteScroll'

export const Search = () => {
  const [{ q }] = useQueryParams()

  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['search', q],
    queryFn: ({ pageParam }) => getAllAudioAnalysesByYoutubeSearch({ searchQuery: q, continuation: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.continuation,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })

  // third party library used on the backend for searching on youtube sometimes returns duplicate results between pages
  // so it is filtered to remove those duplicates
  const results = data?.pages.flatMap(({ results }) => results) || []
  const mappedResults = Object.values(results.reduce((resultsAcc, result) => {
    const exists = resultsAcc[result.youtubeId] || false
    if (!exists) return { ...resultsAcc, [result.youtubeId]: result }
    return resultsAcc
  }, {}))

  return (
    <>
      <main className='container'>
        <div className='results-container'>
          {mappedResults?.length > 0 ? <SearchListResults results={mappedResults} /> : null}
          {isLoading ? <SearchListResultsSkeleton count={10} /> : null}
          {hasNextPage
            ? (
              <InfinityScroll isLoading={isLoading || isFetchingNextPage} onIntersect={fetchNextPage}>
                <SearchListResultsSkeleton count={2} />
              </InfinityScroll>
              )
            : null}

        </div>
      </main>
    </>
  )
}
