import { Router } from 'express'
import { createAudioAnalysis, getAllAudioAnalyses, getAudioAnalysis } from '../controllers/audioAnalysesController.js'

const router = Router()

router.get('/', getAllAudioAnalyses)
router.get('/:youtubeId', getAudioAnalysis)
router.post('/', createAudioAnalysis)

export default router
