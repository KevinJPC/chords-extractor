import { MongoClient, ServerApiVersion } from 'mongodb'

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

    console.log('Mongo DB connection successful')
  } catch (error) {
    console.ersror(error)
    throw new Error('No database connection')
  }
}

export const db = () => {
  if (!_db) throw new Error('No database connection')
  return _db
}
