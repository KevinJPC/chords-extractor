import { useInfiniteQuery } from '@tanstack/react-query'
import { getYoutubeResultsWithAnalyzeStatus } from '../services/audioAnalyses'
import { useQueryParams } from './useQueryParams'

export const useSearchQuery = () => {
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

  return { results: mappedResults, hasNextPage, isFetchingNextPage, data, isLoading, fetchNextPage }
}
