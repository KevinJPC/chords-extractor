import youtubeSearchApi from 'youtube-search-api'

export const youtubeSearch = async ({ query, nextPage }) => {
  if (nextPage) return await youtubeSearchApi.NextPage(nextPage, false, 5)
  return await youtubeSearchApi.GetListByKeyword(query, false, 5, [{ type: 'video' }])
}
