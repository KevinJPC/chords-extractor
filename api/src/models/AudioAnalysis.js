import { AUDIO_ALREADY_ANALYZED } from '../constants/errorCodes.js'
import { audioAnalysesCollection } from '../db/collections.js'
import AppError from '../utils/AppError.js'

class AudioAnalysis {
  id
  youtubeId
  chords
  bpm
  beatTimes
  createdAt
  constructor ({ id, youtubeId, chords, bpm, beatTimes, createdAt }) {
    this.id = id
    this.youtubeId = youtubeId
    this.chords = chords
    this.bpm = bpm
    this.beatTimes = beatTimes
    this.createdAt = createdAt
  }

  static async create ({ youtubeId, chords, bpm, beatTimes }) {
    try {
      const doc = { youtubeId, chords, bpm, beatTimes, createdAt: new Date() }
      const { insertedId } = await audioAnalysesCollection().insertOne(doc)
      const audioAnalysis = new AudioAnalysis({ id: insertedId, youtubeId, chords, bpm, beatTimes, createdAt: doc.createdAt })
      return audioAnalysis
    } catch (error) {
      if (error.code === 11000) throw new AppError(AUDIO_ALREADY_ANALYZED, 'Audio already analyze.', 409)
      throw error
    }
  }

  static async findByYoutubeId ({ youtubeId }) {
    const result = await audioAnalysesCollection().findOne({ youtubeId })
    if (!result) return null
    return new AudioAnalysis({
      id: result._id,
      youtubeId: result.youtubeId,
      chords: result.chords,
      bpm: result.bpm,
      beatTimes: result.beatTimes
    })
  }

  static async findAllByYoutubeIds ({ youtubeIds }) {
    const audioAnalyses = {}
    await audioAnalysesCollection().find({ youtubeId: { $in: youtubeIds } })
      .forEach(({ _id, youtubeId, chords, bpm, beatTimes }) => {
        audioAnalyses[youtubeId] = new AudioAnalysis({ id: _id, youtubeId, chords, bpm, beatTimes })
      })
    return audioAnalyses
  }

  static async findAll ({ query }) {
    // not implemented yet
    // return AudioAnalysis instances
    return undefined
  }
}

export default AudioAnalysis
