import { convertToMp3, analyzeAudio } from '../services/audioService.js'

export const getAudioInfo = async (req, res) => {
  try {
    const { id } = req.params
    const audioPath = await convertToMp3({ id })
    const { chords, bpm, beatTimes } = await analyzeAudio({ audioPath })

    res.status(200).json({
      status: 'sucess',
      data: { chords, bpm, beatTimes }
    })
  } catch (error) {
    console.log(error)
  }
}
