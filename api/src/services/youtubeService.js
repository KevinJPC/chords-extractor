// import youtubeSearchApi from 'youtube-search-api'
import { Client, SearchResult } from 'youtubei'
// import AudioAnalysis from '../models/AudioAnalysis.js'
const youtubeClient = new Client()
export class YoutubeList {
  results
  continuation
  constructor ({ results, continuation }) {
    this.results = results
    this.continuation = continuation
  }

  getResultsIds () {
    return this.results.map(item => item.id)
  }

  async mappedResultsBaseOnAnalyzed ({ resultsAlreadyAnalyzed }) {
    this.results = this.results.map(
      (videoCompact) => {
        const audioAnalysis = resultsAlreadyAnalyzed.find(audioAnalysis => audioAnalysis.youtubeId === videoCompact.id)

        return {
          id: videoCompact.id,
          title: videoCompact.title,
          thumbnails: videoCompact.thumbnails,
          duration: videoCompact.duration,
          audioAnalysisId: audioAnalysis?.id
        }
      })
  }

  static async search ({ searchQuery, continuation }) {
    try {
      let response
      if (continuation) {
        const newSearch = new SearchResult({ client: youtubeClient })
        newSearch.continuation = continuation
        await newSearch.next()
        response = newSearch
      } else {
        response = await youtubeClient.search(searchQuery, {
          type: 'video'
        })
      }
      return new YoutubeList({ results: response.items, continuation: response.continuation })
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export class YoutubeVideoDetails {
  id
  title
  channelTitle
  thumbnails
  duration
  constructor ({ id, title, channelTitle, thumbnails, duration }) {
    this.id = id
    this.title = title
    this.channelTitle = channelTitle
    this.thumbnails = thumbnails
    this.duration = duration
  }

  static async search ({ id }) {
    const videoCompact = await youtubeClient.getVideo(id)

    return new YoutubeVideoDetails({ id: videoCompact, title: videoCompact.title, thumbnails: videoCompact.thumbnails, duration: videoCompact.duration })
  }
}
