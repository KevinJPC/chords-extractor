from utils import set_vamp_path, get_youtube_id_argv, to_json
from analyze import get_audio_data, recognize_bpm_and_beat_times, recognize_chords, map_beats, map_chords_per_beats, download_from_youtube
from errors import Error 
from constants import PROGRESS_STEPS, RESPONSE_EVENTS

def main():
    set_vamp_path()

    youtube_id = get_youtube_id_argv()

    audio_buffer = download_from_youtube(youtube_id)
    print(to_json({'event': RESPONSE_EVENTS['PROGRESS'], 'data': {'step': PROGRESS_STEPS['AUDIO_DATA_OBTAINING_FINISHED']}}))

    audio_data, sample_rate = get_audio_data(audio_buffer)

    bpm, beat_times = recognize_bpm_and_beat_times(audio_data, sample_rate)
    print(to_json({'event': RESPONSE_EVENTS['PROGRESS'], 'data': {'step': PROGRESS_STEPS['BPM_AND_BEAT_TIMES_RECOGNITION_FINISHED']}}))

    chords = recognize_chords(audio_data, sample_rate)
    print(to_json({'event': RESPONSE_EVENTS['PROGRESS'], 'data': {'step': PROGRESS_STEPS['CHORDS_RECOGNITION_FINISHED']}}))

    beats = map_beats(beat_times)
    print(to_json({'event': RESPONSE_EVENTS['PROGRESS'], 'data': {'step': PROGRESS_STEPS['BEATS_MAPPING_FINISHED']}}))

    chords_per_beats = map_chords_per_beats(chords, beats)
    print(to_json({'event': RESPONSE_EVENTS['PROGRESS'], 'data': {'step': PROGRESS_STEPS['CHORDS_PER_BEATS_MAPPING_FINISHED']}}))

    print(to_json({'event': RESPONSE_EVENTS['SUCCESS'], 'data': {'bpm': bpm, 'beats': beats, 'chords_per_beats': chords_per_beats}}))

if __name__ == '__main__':
    main()



