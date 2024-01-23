import librosa
import vamp
from utils import print_response

CHORDINO_PARAMETERS = {
    'useNNLS': 1, # 0 or 1, default 1
    'rollon': 1, # 0 - 5
    'tuningmode': 0, # Global = 0 Local = 1, default 0
    'whitening': .8, # 0 - 1 default 1
    's': .5, # 0.5 - 0.9, default 0.7
    'boostn': 0.1 # 0 - 1, default .1
}

def analyze_audio(audio_path):
  print_response('progress', {'progress': 0})
  
  audio_data, sample_rate = get_audio_data(audio_path)
  print_response('progress', {'progress': 10})

  bpm, beat_times = recognize_bpm_and_beat_times(audio_data, sample_rate)
  print_response('progress', {'progress': 50})

  chords = recognize_chords(audio_data, sample_rate)
  print_response('progress', {'progress': 90})
  
  beats = map_beats(beat_times)
  chords_per_beats = map_chords_per_beats(chords, beats)
  print_response('progress', {'progress': 100})

  return bpm, beats, chords_per_beats

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