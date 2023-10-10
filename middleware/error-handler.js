const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again'
  }

    if (err.name === "CastError") {
      customError.statusCode = StatusCodes.NOT_FOUND
      customError.msg =  `No job found with id ${err.value._id}`
    }

  if (err.name === "ValidationError") {
    const missingFields = Object.keys(err.errors)
    customError.statusCode = StatusCodes.NOT_FOUND
    customError.msg =  `Please include values for ${missingFields}`
  }

  if (err.code && err.code === 11000) {
    customError.msg = `${Object.values(err.keyValue)} is already in use. Please try another ${Object.keys(err.keyValue)}.`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  return res.status(customError.statusCode).json(customError.msg)
}

module.exports = errorHandlerMiddleware


