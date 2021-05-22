import { Request, Response, NextFunction } from 'express'

import AppException from "./App.exception"


const exceptionMiddleware = async (error: Error, _: Request, resp: Response, next: NextFunction) => {
  if (error instanceof AppException) {
    resp.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
    return;
  }
  next()
}

export { exceptionMiddleware }
export default AppException