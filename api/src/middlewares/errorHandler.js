import AppError from '../utils/AppError.js'
import { writeSseResponse, isSseEndpoint } from '../utils/sse.js'

const sendResponseError = (error, req, res) => {
  if (isSseEndpoint(res)) {
    writeSseResponse(res, { event: 'error', data: { errorMessage: error.message } })
    return res.end()
  }
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
