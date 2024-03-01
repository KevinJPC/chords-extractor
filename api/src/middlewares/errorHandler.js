import AppError from '../utils/AppError.js'

const sendResponseError = (error, req, res) => {
  return res.status(error.statusCode).json({
    status: 'fail',
    errorCode: error.errorCode,
    message: error.message
  })
}

export const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) return sendResponseError(error, req, res)
  const defaultError = new AppError(null, 'Something went wrong', 400)
  console.log(error)
  return sendResponseError(defaultError, req, res)
}
