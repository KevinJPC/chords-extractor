import { Router } from 'express'
import { getAudioInfo } from '../controllers/audioController.js'

const router = Router()

router.get('/:id', getAudioInfo)

export default router
