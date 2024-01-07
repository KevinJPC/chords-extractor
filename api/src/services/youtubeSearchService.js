import youtubeSearchApi, { NextPage } from 'youtube-search-api'

export const youtubeSearch = async ({ query, page }) => {
  let result
  if (page) {
    result = await youtubeSearchApi.NextPage(page, false, 5)
  } else {
    result = await youtubeSearchApi.GetListByKeyword(query, false, 5, [{ type: 'video' }])
  }

  const mappedItems = result.items.map(item => ({
    id: item.id,
    thumbnail: item.thumbnail,
    title: item.title,
    channelTitle: item.channelTitle,
    length: item.length.simpleText
  }))

  return { items: mappedItems, nextPage: result.nextPage }
}
