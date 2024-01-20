class Error(Exception):
  def __init__(self, message, code):
    super().__init__(message)
    self.code = code

class NotAudioPathArgvError(Error):
  def __init__(self):
    super().__init__("Audio path not provided", 1)

class AudioFileNotFoundError(Error):
  def __init__(self):
    super().__init__("Audio file not found", 2)

class VampPathDoesNotExistsError(Error):
  def __init__(self, path):
    super().__init__(f"Vamp path: {path} doesn't exist", 3)