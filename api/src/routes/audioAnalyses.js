import { Router } from 'express'
import { createAudioAnalysis, getAllAudioAnalysesBySource, getAudioAnalysis } from '../controllers/audioAnalysesController.js'

const router = Router()
router.get('/', getAllAudioAnalysesBySource)
router.get('/:youtubeId', getAudioAnalysis)
router.post('/', createAudioAnalysis)

export default router
