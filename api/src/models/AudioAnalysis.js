import { ObjectId } from 'mongodb'
import { AUDIO_ALREADY_ANALYZED } from '../constants/errorCodes.js'
import { audioAnalysesCollection } from '../db/collections.js'
import AppError from '../utils/AppError.js'

class AudioAnalysis {
  id
  youtubeId
  title
  duration
  thumbnails
  chords
  bpm
  beatTimes
  createdAt
  constructor ({ id, youtubeId, title, thumbnails, duration, chords, bpm, beatTimes, createdAt }) {
    this.id = id
    this.youtubeId = youtubeId
    this.title = title
    this.thumbnails = thumbnails
    this.duration = duration
    this.chords = chords
    this.bpm = bpm
    this.beatTimes = beatTimes
    this.createdAt = createdAt
  }

  static async create ({ youtubeId, title, thumbnails, duration, chords, bpm, beatTimes }) {
    try {
      const doc = { youtubeId, title, thumbnails, duration, chords, bpm, beatTimes, createdAt: new Date() }
      const { insertedId } = await audioAnalysesCollection().insertOne(doc)
      const newAudioAnalysis = new AudioAnalysis({ id: insertedId, ...doc })
      return newAudioAnalysis
    } catch (error) {
      if (error.code === 11000) throw new AppError(AUDIO_ALREADY_ANALYZED, 'Audio already analyze.', 409)
      throw error
    }
  }

  static async findById ({ id }) {
    const doc = await audioAnalysesCollection().findOne({ _id: new ObjectId(id) })
    if (!doc) return null
    return new AudioAnalysis({
      id: doc._id,
      youtubeId: doc.youtubeId,
      title: doc.title,
      thumbnails: doc.thumbnails,
      duration: doc.duration,
      chords: doc.chords,
      bpm: doc.bpm,
      beatTimes: doc.beatTimes,
      createdAt: doc.createdAt
    })
  }

  static async findByYoutubeId ({ youtubeId }) {
    const doc = await audioAnalysesCollection().findOne({ youtubeId })
    if (!doc) return null
    return new AudioAnalysis({
      id: doc._id,
      youtubeId: doc.youtubeId,
      title: doc.title,
      thumbnails: doc.thumbnails,
      duration: doc.duration,
      chords: doc.chords,
      bpm: doc.bpm,
      beatTimes: doc.beatTimes,
      createdAt: doc.createdAt
    })
  }

  static async findAllByYoutubeIds ({ youtubeIds }) {
    const audioAnalyses = []
    await audioAnalysesCollection().find({ youtubeId: { $in: youtubeIds } })
      .forEach(({ _id: id, ...doc }) => {
        audioAnalyses.push(new AudioAnalysis({ id, ...doc }))
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
