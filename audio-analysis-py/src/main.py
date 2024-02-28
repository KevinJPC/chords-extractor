from utils import set_vamp_path, get_youtube_id_argv, print_json
from analyze import get_audio_data, recognize_bpm_and_beat_times, recognize_chords, map_beats, map_chords_per_beats, download_from_youtube
from errors import Error 
from constants import RESPONSE_STATUS

def main():
    set_vamp_path()

    youtube_id = get_youtube_id_argv()

    audio_buffer = download_from_youtube(youtube_id)

    audio_data, sample_rate = get_audio_data(audio_buffer)

    bpm, beat_times = recognize_bpm_and_beat_times(audio_data, sample_rate)

    chords = recognize_chords(audio_data, sample_rate)

    beats = map_beats(beat_times)

    chords_per_beats = map_chords_per_beats(chords, beats)

    # raise Error('error')

    print_json({'status': RESPONSE_STATUS['SUCCESS'], 'data': {'bpm': bpm, 'beats': beats, 'chords_per_beats': chords_per_beats}})

if __name__ == '__main__':
    main()



