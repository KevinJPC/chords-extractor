import { queryClient } from '../config/queryClient.js'
import { useQueryParams } from './useQueryParams.js'

export const useUpdateSearchQueryData = () => {
  const [{ q }] = useQueryParams()

  const updateResult = ({ youtubeId, data }) => {
    const searchData = queryClient.getQueryData(['search', q])

    for (let pageIndex = 0; pageIndex < searchData.pages.length; pageIndex++) {
      for (let resultIndex = 0; resultIndex < searchData.pages[pageIndex].results.length; resultIndex++) {
        const result = searchData.pages[pageIndex].results[resultIndex]
        if (result.youtubeId === youtubeId) {
          searchData.pages[pageIndex].results[resultIndex] = {
            ...result,
            ...data
          }
          return
        }
      }
    }
  }
  return { updateResult }
}
