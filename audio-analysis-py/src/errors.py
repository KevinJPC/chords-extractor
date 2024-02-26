class Error(Exception):
  def __init__(self, message):
    super().__init__(message)

class NotYouTubeIdArgvError(Error):
  def __init__(self):
    super().__init__("Youtube id not provided")

class VampPathDoesNotExistsError(Error):
  def __init__(self, path):
    super().__init__(f"Vamp path: {path} doesn't exist")