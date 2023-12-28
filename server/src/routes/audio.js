import { Router } from 'express'
import { getAudioInfo } from '../controllers/audioController.js'

const router = Router()

router.get('/:link', getAudioInfo)

export default router
