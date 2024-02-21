import { Client, SearchResult } from 'youtubei'

export class YoutubeService {
  #client
  constructor () {
    this.#client = new Client()
  }

  async search ({ query, continuation }) {
    try {
      let response
      if (continuation) {
        const newSearch = new SearchResult({ client: this.#client })
        newSearch.continuation = continuation
        await newSearch.next()
        response = newSearch
      } else {
        response = await this.#client.search(query, {
          type: 'video'
        })
      }
      return { results: response.items, continuation: response.continuation }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async findVideo ({ id }) {
    const video = await this.#client.getVideo(id)

    return video !== undefined
      ? ({
          id: video.id,
          title: video.title,
          thumbnails: video.thumbnails,
          duration: video.duration
        })
      : undefined
  }
}

export const youtubeService = new YoutubeService()
