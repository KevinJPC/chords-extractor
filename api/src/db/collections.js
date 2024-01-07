import { db } from './conn.js'

export const audioAnalysesCollection = () => db().collection('audio-analyses')
