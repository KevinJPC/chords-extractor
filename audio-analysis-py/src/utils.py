import os
import sys
import json
import librosa
from errors import NotAudioPathArgvError, AudioFileNotFoundError, VampPathDoesNotExistsError

SCRIPT_PATH = os.path.abspath(__file__)
VAMP_PATH_NAME = 'VAMP_PATH'
VAMP_PATH = os.path.join(os.path.dirname(SCRIPT_PATH), '..', 'lib', 'vamp-plugins')

def set_vamp_path():
  if(not os.path.exists(VAMP_PATH)):
    raise VampPathDoesNotExistsError(VAMP_PATH)
  os.environ[VAMP_PATH_NAME] = VAMP_PATH
  

def to_json(data):
  json_data = json.dumps(data)
  return json_data
  
def get_audio_path_argv():
  try:
    audio_path = sys.argv[1]
    return audio_path
  except IndexError:
    raise NotAudioPathArgvError()

def print_response(event, data):
  response = to_json({'event': event, 'data': data})
  print(response)