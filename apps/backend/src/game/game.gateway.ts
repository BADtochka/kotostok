import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game } from './entities/game.entity';

@WebSocketGateway(80, {
  cors: {
    credentials: true,
    origin: '*',
  },
})
export class GameGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async join(
    @MessageBody() data: { roomId: Game['id'] },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    client.emit('joined', { roomId: data.roomId });
  }
}
