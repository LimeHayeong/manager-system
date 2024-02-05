import { ArgumentsHost, Catch, Logger } from '@nestjs/common'

import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { SocketException } from '../types/socket.exception'

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
  private logger: Logger = new Logger('[System] Socket-Exception')
  catch(exception: SocketException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>()
    const status = exception.getError()['status'] || 'InternalServerError'
    const message = exception.getError()['message'] || 'Internal Server Error'
    const statusCode = exception.getError()['statusCode'] || 500

    // 클라이언트에 에러 메시지 전송

    this.logger.error(`Client-id: ${client.id} - ${status} - ${message}`)
    client.emit('Exception', {
      success: false,
      statusCode: statusCode,
      error: status,
      message,
    })

    // 아 무조건 종료해도 안되는구나.
    // client.disconnect()
  }
}
