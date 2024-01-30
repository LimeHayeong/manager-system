import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
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
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit(server: Server) {
    console.log('ws gateway initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      this.wsService.getInitial();
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

  @OnEvent('taskStateUpdate')
  handleTaskStateUpdate(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: data,
    }
    this.server.emit('taskStateUpdate', response);
  }

  @OnEvent('taskLog')
  handleTaskLog(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: data,
    }
    this.server.emit('taskLog', response);
  }

  @OnEvent('getIntialTaskStatesResponse')
  handleIntialState(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: data,
    }
    this.server.emit('connectResponse', response);
  }
}
