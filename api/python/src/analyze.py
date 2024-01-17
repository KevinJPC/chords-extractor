import librosa
import vamp

CHORDINO_PARAMETERS = {
    'useNNLS': 1, # 0 or 1, default 1
    'rollon': 1, # 0 - 5
    'tuningmode': 0, # Global = 0 Local = 1, default 0
    'whitening': .8, # 0 - 1 default 1
    's': .5, # 0.5 - 0.9, default 0.7
    'boostn': 0 # 0 - 1, default .1
}

def analyze_audio(audio_path):

  audio_data, sample_rate = get_audio_data(audio_path)

  chords = recognize_chords(audio_data, sample_rate)
  bpm, beat_times = recognize_bpm_and_beat_times(audio_data, sample_rate)

  return bpm, beat_times

def map_chords_and_beats(beat_times, chords):
  chords_and_beats = []
  for beat_time_index in range(len(beat_times)):
    current_beat_time = beat_times[beat_time_index]
    next_beat_time = beat_times[beat_time_index + 1]
    # current_chord_change = chords
    # chords_and_beats[current_beat_time]
    
  return None

def get_audio_data(audio_path):
  try:
    audio_data, sample_rate = librosa.load(audio_path)
    return audio_data, sample_rate
  except FileNotFoundError:
    raise AudioFileNotFoundError()

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