import { Router } from 'express'
import {
  createAudioAnalysisJob,
  getYoutubeResultsWithAnalyzeStatus,
  getAudioAnalysisByYoutubeId,
  getAudioAnalysisJob
} from '../controllers/audioAnalysesController.js'

const router = Router()
router.get('/youtube-search', getYoutubeResultsWithAnalyzeStatus)
router.get('/:youtubeId', getAudioAnalysisByYoutubeId)
router.post('/job', createAudioAnalysisJob)
router.get('/job/:id', getAudioAnalysisJob)

export default router
