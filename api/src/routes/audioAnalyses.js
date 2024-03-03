import { Router } from 'express'
import {
  getAudioAnalysis,
  getYoutubeResultsWithAnalyzeStatus,
  createAudioAnalysisJob,
  getAudioAnalysisJob
} from '../controllers/audioAnalysesController.js'

const router = Router()
router.get('/youtube-search', getYoutubeResultsWithAnalyzeStatus)
router.get('/:id', getAudioAnalysis)
router.post('/job', createAudioAnalysisJob)
router.get('/job/:id', getAudioAnalysisJob)

export default router
