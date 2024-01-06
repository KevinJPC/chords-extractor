import { db } from '../db/conn.js'

const audioAnalysesCollection = () => db().collection('audio-analyses')

class AudioAnalysis {
  id
  youtubeId
  chords
  bpm
  beatTimes
  constructor ({ id, youtubeId, chords, bpm, beatTimes }) {
    this.id = id
    this.youtubeId = youtubeId
    this.chords = chords
    this.bpm = bpm
    this.beatTimes = beatTimes
  }

  static async create ({ youtubeId, chords, bpm, beatTimes }) {
    // not implemented yet
    // return AudioAnalysis instance
    const doc = { youtubeId, chords, bpm, beatTimes }
    const result = await audioAnalysesCollection().insertOne(doc)
    // const audioAnalysis = new AudioAnalysis(...result)
    return result
  }

  static async findByYoutubeId ({ youtubeId }) {
    // not implemented yet
    // return AudioAnalysis instance
    return undefined
  }

  static async findAll ({ query }) {
    // not implemented yet
    // return AudioAnalysis instances
    return undefined
  }
}

export default AudioAnalysis
