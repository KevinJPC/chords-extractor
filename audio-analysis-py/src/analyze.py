import io
import librosa
import vamp
import pytube
import pydub

CHORDINO_PARAMETERS = {
    'useNNLS': 1, # 0 or 1, default 1
    'rollon': 1, # 0 - 5
    'tuningmode': 0, # Global = 0 Local = 1, default 0
    'whitening': .8, # 0 - 1 default 1
    's': .5, # 0.5 - 0.9, default 0.7
    'boostn': 0.1 # 0 - 1, default .1
}

def map_beats(beat_times):
  beats_mapped = []
  beat_times_length = range(len(beat_times) - 1) 
  for beat_time_index in beat_times_length:
    next_beat_time = beat_times[beat_time_index + 1]
    current_beat_time = beat_times[beat_time_index]

    beat = {
      'start_time': current_beat_time,
      'end_time': next_beat_time
      }

    beats_mapped.append(beat)
    
  return beats_mapped

def map_chords_per_beats(chords, beats):
  chords_per_beats = []
  for beat in beats:
    start_time, end_time = beat["start_time"], beat["end_time"]
    current_chord = next((chord["label"] for chord in chords if start_time <= float(chord["timestamp"]) < end_time), None)
      
    chords_per_beats.append(current_chord)
    
  return chords_per_beats

def download_from_youtube(youtube_id):
  youtube_video = pytube.YouTube.from_id(youtube_id)

  # buffer to store the file in memory
  audio_mp4 = io.BytesIO()

  # filter the video streams, get one and move it to the buffer
  youtube_video.streams.\
    filter(only_audio=True, file_extension='mp4')\
    .first()\
    .stream_to_buffer(audio_mp4)

  # convert audio from mp4 to wav for librosa to read it

  audio_mp4.seek(0) # move the pointer at beginning of the "file like" object
  
  audio = pydub.AudioSegment.from_file(audio_mp4, format="mp4")
  
  audio_mp4.close()

  audio_wav = io.BytesIO()
  audio.export(audio_wav, format='wav')

  audio_wav.seek(0) # move the pointer at beginning of the "file like" object

  return audio_wav

def get_audio_data(buffer):
  audio_data, sample_rate = librosa.load(buffer)
  return audio_data, sample_rate

def recognize_chords(audio_data, sample_rate):
  chroma = vamp.collect(
      audio_data, 
      sample_rate, 
      "nnls-chroma:chordino", 
      parameters=CHORDINO_PARAMETERS
    ) 
  chords = chroma['list']

  return chords

def recognize_bpm_and_beat_times(audio_data, sample_rate):
  onset_envelope = librosa.onset.onset_strength(y=audio_data, sr=sample_rate)

  bpm, beat_times = librosa.beat.beat_track(onset_envelope=onset_envelope, sr=sample_rate, units='time')

  return bpm, beat_times