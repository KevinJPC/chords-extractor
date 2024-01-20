from utils import set_vamp_path, get_audio_path_argv, print_response
from analyze import analyze_audio
from errors import Error 

def main():
    try: 
        set_vamp_path()

        audio_path = get_audio_path_argv()

        bpm, beats, chords = analyze_audio(audio_path)

        print_response('result', {'bpm': bpm, 'beats': beats, 'chords': chords})

    except Error as e:
        print_response('error', {'message': e.args[0], 'code': e.code})
    except Exception as e:
        print_response('error', {'message': e.args[0]})

if __name__ == '__main__':
    main()



