import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { WebSocketError, WebSocketResponse } from '../types/ws';

import { NewTaskLogRequestDTO } from './dto/new-task-log.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Task } from '../types/task';
import { WsService } from './ws.service';
import { v4 as uuid } from 'uuid';

@WebSocketGateway(3031, { namespace: 'ws', cors: { origin: '*'} })
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

  @SubscribeMessage('reloadTaskLog')
  handleReloadTaskLog(client: Socket, data: Task.ITaskIdentity){
    console.log('reloadTaskLog', data);
    this.wsService.reloadTaskLog(data);
  }

  @SubscribeMessage('newTaskLog')
  handleNewTaskLog(client: Socket, data: NewTaskLogRequestDTO){
    this.wsService.newTaskLog(data)
  }

  // 내부 event
  @OnEvent('taskStateUpdate')
  async handleTaskStateUpdate(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      responseId: uuid(),
      payload: data,
    }
    this.server.emit('taskStateUpdate', response);
  }

  //(deprecated) 내부 event
  // @OnEvent('taskLog')
  // handleTaskLog(data: any){
  //   const response: WebSocketResponse = {
  //     success: true,
  //     statusCode: 200,
  //     responseId: uuid(),
  //     payload: data,
  //   }
  //   this.server.emit('taskLog', response);
  // }

  // 내부 event
  @OnEvent('initailTaskStatesResponse')
  async handleIntialState(data: any){
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      responseId: uuid(),
      payload: data,
    }
    this.server.emit('connectResponse', response);
  }

  // 내부 event
  @OnEvent('reloadTaskLogResponse')
  async handleReloadTaskLogResponse(data: any){
    let response: WebSocketResponse | WebSocketError;
    if(!data){
      // 데이터가 없으면
      response = {
        success: false,
        statusCode: 500,
        responseId: uuid(),
        error: "없는 Task 입니다."
      }
    }else{
      response = {
        success: true,
        statusCode: 200,
        responseId: uuid(),
        payload: data,
      }
    }
    this.server.emit('reloadTaskLogResponse', response);
  }

  // 내부 event
  @OnEvent('newTaskLogResponse')
  async handleNewTaskLogResponse(data: any){
    let response: WebSocketResponse | WebSocketError;
    if(!data){
      // 데이터가 없으면
      response = {
        success: false,
        statusCode: 500,
        responseId: uuid(),
        error: "없는 Task 입니다."
      }
    }else{
      response = {
        success: true,
        statusCode: 200,
        responseId: uuid(),
        payload: data,
      }
    }
    this.server.emit('newTaskLogResponse', response);
  }
}
