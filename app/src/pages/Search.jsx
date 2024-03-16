import { SearchListResults } from '../components/SearchListResults'
import { InfinityScroll } from '../components/InfiniteScroll'
import './Search.css'
import { useSearchQuery } from '../hooks/useSearchQuery'
import { AudioCardSkeleton } from '../components/AudioCardSkeleton'

export const Search = () => {
  const { results, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } = useSearchQuery()
  return (
    <>
      <main className='container'>
        <SearchListResults>
          <ul className='results'>
            {isLoading &&
              <>
                {Array(10).fill().map((_, index) =>
                  <li key={`skeleton-${index}`}><AudioCardSkeleton /></li>)}
              </>}
            {results.length > 0 &&
              <>
                {results.map(({ youtubeId, thumbnails, title, duration, audioAnalysis, isAnalyzed }) =>
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
                  <AudioCardSkeleton />
                </InfinityScroll>
              </li>}
          </ul>
        </SearchListResults>
      </main>
    </>
  )
}
