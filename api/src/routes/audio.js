import { Router } from 'express'
import { createAudioAnalysis } from '../controllers/audioController.js'

const router = Router()

router.post('/', createAudioAnalysis)
// router.get('/:id', getAudioAnalysis)

export default router
