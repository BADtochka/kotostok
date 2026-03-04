import { APP_CONFIG } from '@/configs/app';
import { isDev } from '@/constants/isDev';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game } from './entities/game.entity';

@WebSocketGateway(APP_CONFIG.SOCKET_PORT, {
  cors: {
    credentials: true,
    origin: isDev ? '*' : APP_CONFIG.FRONTEND_URL,
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
