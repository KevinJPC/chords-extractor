import sys
import numpy 
from utils import to_json, set_vamp_path, get_audio_path_argv
from errors import Error
from analyze import recognize_chords, recognize_bpm_and_beat_times, analyze_audio

# from itertools import starmap
# set_printoptions(suppress=True)

# try:

set_vamp_path()

audio_path = get_audio_path_argv()

bpm, chords_and_beats = analyze_audio(audio_path)

# print(bpm, chords_and_beats)
# response = {'status': 'sucess', 'data': {'chords': chords, 'bpm': bpm, 'beat_times': list(beat_times), 'beat_frames': len(list(beat_frames))}}
# print(response)

# except Error as error:
    # response = to_json({'status': 'fail', 'message': error.args[0], 'error_code': error.code})

# except Exception as e:
    # response = to_json({'status': 'fail', 'message': 'Something went wrong'})





