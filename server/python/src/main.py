import sys
from chord_extractor.extractors import Chordino
from itertools import starmap
from numpy import set_printoptions
from librosa import load, frames_to_time
from librosa.beat import beat_track
from json import dumps

set_printoptions(suppress=True)

audio_path = sys.argv[1]

def recognize_chords(audio_path):
    try:
        chordino = Chordino(roll_on=1)  
        chords = chordino.extract(audio_path)

        chords_mapped = list(starmap(lambda chord, timestamp: {'chord': chord, 'timestamp': timestamp}, chords))

        return chords_mapped

    except Exception as e:
        raise e

def recognize_bpm_and_beat_times(audio_path):
    try:
        wave_form, sample_rate = load(audio_path)

        bpm, beat_frames = beat_track(y=wave_form, sr=sample_rate)
        beat_times = frames_to_time(beat_frames, sr=sample_rate)

        return bpm, beat_times

    except Exception as e:
        raise e

try:
    chords = recognize_chords(audio_path)
    bpm, beat_times = recognize_bpm_and_beat_times(audio_path)

    response = {'status': 'sucess', 'data': {'chords': chords, 'bpm': bpm, 'beat_times': list(beat_times)}}
    print(dumps(response))

except FileNotFoundError:
    response = {'status': 'fail'}
    print(dumps(response))

except Exception as e:
    response = {'status': 'fail'}
    print(dumps(response))
    raise e
