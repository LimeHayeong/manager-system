import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

import { WebSocketResponse } from '../types/ws';
import { WsService } from './ws.service';
import { v4 as uuid } from 'uuid';

@WebSocketGateway(3031, { namespace: 'ws', cors: { origin: '*'} })
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

  // 내부 event
  @OnEvent('taskStateUpdate')
  handleTaskStateUpdate(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      responseId: uuid(),
      payload: data,
    }
    this.server.emit('taskStateUpdate', response);
  }

  // 내부 event
  @OnEvent('taskLog')
  handleTaskLog(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      responseId: uuid(),
      payload: data,
    }
    this.server.emit('taskLog', response);
  }

  // 내부 event
  @OnEvent('initailTaskStatesResponse')
  handleIntialState(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      responseId: uuid(),
      payload: data,
    }
    this.server.emit('connectResponse', response);
  }
}
