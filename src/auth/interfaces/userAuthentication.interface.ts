import { ParseUUIDPipe } from '@nestjs/common';
export interface IUserAuthentication {
  readonly id: ParseUUIDPipe;
  readonly name: string;
  readonly email: string;
}
