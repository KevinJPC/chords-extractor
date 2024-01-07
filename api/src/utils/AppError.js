class AppError extends Error {
  statusCode
  errorCode
  constructor (errorCode, message, statusCode) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
  }
}

export default AppError
