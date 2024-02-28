import { Router } from 'express'
import { createAudioAnalysisJob, getAllOriginalsAudioAnalysesBySource, getAudioAnalysis, getAudioAnalysisJob } from '../controllers/audioAnalysesController.js'

const router = Router()
router.get('/', getAllOriginalsAudioAnalysesBySource)
router.get('/:id', getAudioAnalysis)
router.post('/job', createAudioAnalysisJob)
router.get('/job/:id', getAudioAnalysisJob)

export default router
