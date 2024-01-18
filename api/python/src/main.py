from utils import to_json, set_vamp_path, get_audio_path_argv
from analyze import analyze_audio

def main():
    set_vamp_path()

    audio_path = get_audio_path_argv()

    bpm, beats_and_chords = analyze_audio(audio_path)

    response = to_json({ 'bpm': bpm, 'beats_and_chords': beats_and_chords })
    print(response)

if __name__ == '__main__':
    main()



