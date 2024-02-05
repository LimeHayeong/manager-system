import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common'

import { ApiError } from '../types/response'
import { Response } from 'express'

@Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger('[System] HTTP-Exception')
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const status = exception.getStatus()
      const err = exception.getResponse() as
        | { message: any; statusCode: number; error: string }
        // | { message: string[]; statusCode: 400; error: string[] } // class-validator error
  
      const errorResponse: ApiError = {
        success: false,
        statusCode: status,
        message: err.message,
      }
  
      this.logger.error(
        `${status} ${errorResponse.error} ${errorResponse.message}`,
      )
    // class-validator 에러
    //   if (typeof err !== 'string' && err.statusCode === 400) {
    //     return response.status(status).json(errorResponse)
    //   }
      response.status(status).json(errorResponse)
    }
  }
  