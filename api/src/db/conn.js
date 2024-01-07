import { MongoClient, ServerApiVersion } from 'mongodb'
import { audioAnalysesCollection } from './collections.js'

let _db

export const connectToDb = async () => {
  try {
    const connectionString = process.env.ATLAS_URI || ''
    const client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    const connection = await client.connect()
    _db = connection.db('chords-extractor')
    await _db.command({ ping: 1 })
    await createIndexes()
    console.log('Mongo DB connection successful')
  } catch (error) {
    console.error(error)
    throw new Error('Mongo DB connection failed')
  }
}

const createIndexes = async () => {
  await audioAnalysesCollection().createIndex({ youtubeId: 1 }, { unique: true })
}

export const db = () => {
  if (!_db) throw new Error('No database connection')
  return _db
}
