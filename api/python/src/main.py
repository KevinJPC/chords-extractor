import sys
from chord_extractor.extractors import Chordino
from itertools import starmap
from numpy import set_printoptions
from librosa import load, frames_to_time
from librosa.beat import beat_track
from librosa.onset import onset_strength
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
        wave_form, sample_rate = load(audio_path, sr=None)

        onset_envelope = onset_strength(y=wave_form, sr=sample_rate)

        bpm, beat_frames = beat_track(onset_envelope=onset_envelope, sr=sample_rate)
        beat_times = frames_to_time(beat_frames, sr=sample_rate)

        # print(len(beat_times), 'beat times\n\n\n')
        # print(beat_times, 'beat times\n\n\n')
        return bpm, beat_times, beat_frames

    except Exception as e:
        raise e

try:
    chords = recognize_chords(audio_path)
    bpm, beat_times, beat_frames = recognize_bpm_and_beat_times(audio_path)

    response = {'status': 'sucess', 'data': {'chords': chords, 'bpm': bpm, 'beat_times': list(beat_times), 'beat_frames': len(list(beat_frames))}}
    print(dumps(response))

except FileNotFoundError:
    response = {'status': 'fail', 'message': 'File not found'}
    print(dumps(response))

except Exception as e:
    response = {'status': 'fail', 'message': 'Something went wrong'}
    print(dumps(response))
    raise e
