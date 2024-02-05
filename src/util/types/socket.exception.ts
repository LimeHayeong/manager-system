import { WsException } from '@nestjs/websockets'

export type SocketExceptionStatus =
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'BadRequest'
  | 'InternalServerError'
  | 'GatewayTimeout'
  | 'UnknownError'

export class SocketException extends WsException {
  constructor(
    status: SocketExceptionStatus,
    message: string,
    statusCode?: number,
  ) {
    super({ status, message, statusCode })
  }
}
