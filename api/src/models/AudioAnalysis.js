import { ObjectId } from 'mongodb'
import { AUDIO_ALREADY_ANALYZED } from '../constants/errorCodes.js'
import { audioAnalysesCollection } from '../db/collections.js'
import AppError from '../utils/AppError.js'

class AudioAnalysis {
  id
  youtubeId
  title
  thumbnails
  duration
  isOriginal
  bpm
  beats
  chordsPerBeats
  numRatings
  totalRating
  user
  editTitle
  createdAt
  modifiedAt
  constructor ({
    id, youtubeId, title, thumbnails, duration, isOriginal, bpm, beats, chordsPerBeats,
    numRatings, totalRating,
    user, editTitle, createdAt, modifiedAt
  }) {
    this.id = id
    this.youtubeId = youtubeId
    this.title = title
    this.thumbnails = thumbnails
    this.duration = duration
    this.isOriginal = isOriginal
    this.bpm = bpm
    this.beats = beats
    this.chordsPerBeats = chordsPerBeats
    this.numRatings = numRatings
    this.totalRating = totalRating

    this.user = user
    this.editTitle = editTitle

    this.createdAt = createdAt
    this.modifiedAt = modifiedAt
  }

  static async create ({ youtubeId, title, thumbnails, duration, bpm, beats, chordsPerBeats }) {
    try {
      const date = new Date()
      const doc = {
        youtubeId,
        title,
        thumbnails,
        duration,
        isOriginal: true,
        bpm,
        beats,
        chordsPerBeats,
        numRatings: 0,
        totalRating: 0,
        createdAt: date,
        modifiedAt: date
      }
      const { insertedId } = await audioAnalysesCollection().insertOne(doc)
      const newAudioAnalysis = { _id: insertedId, ...doc }
      return newAudioAnalysis
    } catch (error) {
      if (error.code === 11000) throw new AppError(AUDIO_ALREADY_ANALYZED, 'Audio already analyze.', 409)
      throw error
    }
  }

  static async createCopy ({ fromId, editTitle, newChordsPerBeats }) {
    // try {
    const audioAnalysisToCopy = audioAnalysesCollection().findOne({ _id: new ObjectId(fromId) })
    if (!audioAnalysisToCopy) return null

    const date = new Date()
    const doc = {
      ...audioAnalysisToCopy,
      chordsPerBeats: newChordsPerBeats,
      isOriginal: false,
      numRatings: 0,
      totalRating: 0,
      createdAt: date,
      modifiedAt: date,
      editTitle
      // user
    }
    const { insertedId } = await audioAnalysesCollection().insertOne(doc)
    const newAudioAnalysisCopy = { _id: insertedId, ...doc }
    return newAudioAnalysisCopy
    // } catch (error) {
    // throw error
    // }
  }

  static async findById ({ id }) {
    const audioAnalysis = await audioAnalysesCollection().findOne({ _id: new ObjectId(id) })
    if (!audioAnalysis) return null
    return audioAnalysis
  }

  static async findByYoutubeId ({ youtubeId }) {
    const audioAnalysis = await audioAnalysesCollection().findOne({ youtubeId })
    if (!audioAnalysis) return null
    return audioAnalysis
  }

  static async findAllByYoutubeIds ({ youtubeIds }) {
    const audioAnalyses = []
    await audioAnalysesCollection().find({ youtubeId: { $in: youtubeIds } })
      .forEach((audioAnalysis) => {
        audioAnalyses.push(audioAnalysis)
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
