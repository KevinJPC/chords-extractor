import { Router } from 'express'
import { getAudioInfo, analyzeAudio } from '../controllers/audioController.js'

const router = Router()

router.post('/', analyzeAudio)
// router.get('/:id', getAudioInfo)

export default router
