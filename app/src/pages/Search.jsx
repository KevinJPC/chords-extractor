import './Search.css'
import { getYoutubeResultsWithAnalyzeStatus } from '../services/audioAnalyses'
import { useQueryParams } from '../hooks/useQueryParams'
import { SearchListResults } from '../components/SearchListResults'
import { useInfiniteQuery } from '@tanstack/react-query'
import { InfinityScroll } from '../components/InfiniteScroll'

export const Search = () => {
  const [{ q }] = useQueryParams()

  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['search', q],
    queryFn: ({ pageParam }) => getYoutubeResultsWithAnalyzeStatus({ q, continuation: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.continuation,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })

  const results = data?.pages.flatMap(({ results }) => results) || []
  // third party library used on the backend for searching on youtube sometimes returns duplicate results between pages
  // so it is filtered to remove those duplicates
  const mappedResults = Object.values(results.reduce((resultsAcc, result) => {
    const exists = resultsAcc[result.youtubeId] || false
    if (!exists) return { ...resultsAcc, [result.youtubeId]: result }
    return resultsAcc
  }, {}))

  return (
    <>
      <main className='container'>
        <SearchListResults>
          <ul className='results'>
            {isLoading &&
              <>
                {Array(10).fill().map((_, index) =>
                  <li key={`skeleton-${index}`}><SearchListResults.ItemSkeleton /></li>)}
              </>}
            {mappedResults.length > 0 &&
              <>
                {mappedResults.map(({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) =>
                  <li key={youtubeId}>
                    <SearchListResults.Item
                      youtubeId={youtubeId}
                      title={title}
                      thumbnails={thumbnails}
                      duration={duration}
                      isAnalyzed={isAnalyzed}
                      audioAnalysis={audioAnalysis}
                    />
                  </li>)}
              </>}
            {hasNextPage &&
              <li>
                <InfinityScroll isLoading={isLoading || isFetchingNextPage} onIntersect={fetchNextPage}>
                  <SearchListResults.ItemSkeleton />
                </InfinityScroll>
              </li>}
          </ul>
        </SearchListResults>
      </main>
    </>
  )
}
