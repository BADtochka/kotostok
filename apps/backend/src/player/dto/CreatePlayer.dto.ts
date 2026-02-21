import { CreatePlayerRequest } from '@shared';

export class CreatePlayerDto implements CreatePlayerRequest {
  username: string;
}
