import os
import sys
import json
import librosa
from errors import NotYouTubeIdArgvError, VampPathDoesNotExistsError

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

def get_youtube_id_argv():
  try:
    youtube_id = sys.argv[1]
    return youtube_id
  except IndexError:
    raise NotYouTubeIdArgvError()

def print_json(data):
  print(to_json(data), flush = True)
