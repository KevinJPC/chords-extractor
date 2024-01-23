import { Router } from 'express'
import { createAudioAnalysis, getAllOriginalsAudioAnalysesBySource, getAudioAnalysis } from '../controllers/audioAnalysesController.js'

const router = Router()
router.get('/', getAllOriginalsAudioAnalysesBySource)
router.get('/:id', getAudioAnalysis)
router.post('/', createAudioAnalysis)

export default router
