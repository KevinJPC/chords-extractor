import youtubeSearchApi from 'youtube-search-api'
import AudioAnalysis from '../models/AudioAnalysis.js'

class YoutubeService {
  results
  nextPage
  constructor ({ results, nextPage }) {
    this.results = results
    this.nextPage = nextPage
  }

  getResultsIds () {
    return this.results.map(item => item.id)
  }

  async mappedResultsBaseOnAnalyzed ({ resultsAlreadyAnalyzed }) {
    console.log(resultsAlreadyAnalyzed)

    this.results = this.results.map(
      ({ id, title, thumbnail, channelTitle, length: { simpleText: length } }) => {
        const isAnalyzed = resultsAlreadyAnalyzed.find(audioAnalysis => audioAnalysis.youtubeId === id) !== undefined
        return {
          id,
          title,
          thumbnail,
          channelTitle,
          length,
          isAnalyzed
        }
      })
  }

  static async search ({ searchQuery, page }) {
    try {
      let response
      if (page) {
        response = await youtubeSearchApi.NextPage(page, false, 5)
      } else {
        response = await youtubeSearchApi.GetListByKeyword(searchQuery, false, 5, [{ type: 'video' }])
      }
      return new YoutubeService({ results: response.items, nextPage: response.nextPage })
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default YoutubeService
