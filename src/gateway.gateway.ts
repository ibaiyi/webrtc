import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { ExpressPeerServer } from 'peer';
import { Server, Socket } from "socket.io";
import express from 'express'
@WebSocketGateway()
export class GatewayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


  private app: express.Application;

  // private internetHospital:string = "GaoLing";
  private patientSet: Set<string> = new Set<string>();

  // private doctorMap = new Map<string, { doctorId: string, doctorName: string }>();



  private logger: Logger = new Logger(GatewayGateway.name);

  private doctorId: string = "";
  private doctorRoomId: string = "Room";

  afterInit(server: any) {
    const port = process.env.PORT || 9000;

    this.logger.log('🚚Socket网关初始化完成');

    const express = require("express");

    this.app = express();
    const ss = this.app.listen(port,()=>{
      this.logger.debug(`🔗Peer服务端于${port}端口监听`);
    });
    const peerServer = ExpressPeerServer(ss);

    this.app.use('/dccserver', peerServer);

    // app.get('/', (req: any, res: any, next: any) => res.send('Hello world!'));
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`🔗客户端发起连接,连接ID-----> ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.leave(this.doctorRoomId + this.doctorId);
    this.patientSet.delete(client.id);
    client.to(this.doctorRoomId + this.doctorId).emit('getPatientList', Array.from(this.patientSet));
  }

  @SubscribeMessage('doctorCheckIn')
  doctorCheckIn(@MessageBody() data: {doctorId:string,doctorName:string}, @ConnectedSocket() client: Socket,){
    this.logger.log(`互联网医生开始线上就诊,医生信息：${data.doctorName}`);
    this.doctorId = data.doctorId;
    client.join(this.doctorRoomId + this.doctorId);
  }

  @SubscribeMessage('patientCheckIn')
  patientCheckIncheckIn(@MessageBody() data: { patientId:string,doctorId: string, doctorName: string }, @ConnectedSocket() client: Socket,):string {
    if(this.doctorId === '') {
      return;
    }
    this.logger.log(`患者开始挂号,患者ID:${data}`);
    client.join(this.doctorRoomId + this.doctorId);
    this.patientSet.add(client.id);
    client.to(this.doctorRoomId + this.doctorId).emit('getPatientList', Array.from(this.patientSet).join(","));
    return Array.from(this.patientSet).join(",");
  }
}
