import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

import { WebSocketResponse } from '../types/ws';
import { WsService } from './ws.service';

@WebSocketGateway(3030, { namespace: 'ws', cors: { origin: '*'} })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly wsService: WsService,
  ) {}

  afterInit(server: Server) {
    console.log('ws gateway initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const initialState = this.wsService.getInitial();
      const response: WebSocketResponse = {
        success: true,
        statusCode: 200,
        payload: initialState,
      }
      client.emit('connectResponse', response);
    } catch (e) {
      console.error(e);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    try {

    } catch (e) {
      console.error(e);
      client.disconnect();
    }
  }

  public async sendTaskStateUpdate(data: any) {
    console.log('broadcast taskStateUpdate')
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: data,
    }
    this.server.emit('taskStateUpdate', response);
  }



  public async sendTaskLog(data: any) {
    console.log('broadcast taskLog')
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: data,
    }
    this.server.emit('taskLog', response);
  }
}
