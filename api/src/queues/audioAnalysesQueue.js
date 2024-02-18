import { Queue } from 'bullmq'
import redisConfig from '../config/redis.js'

export const audioAnalysesQueue = new Queue(
  'audio-analyses', {
    connection: { ...redisConfig, enableOfflineQueue: false }
  })
