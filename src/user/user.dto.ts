import { ParseUUIDPipe } from '@nestjs/common';

export class UserDto {
  readonly id: ParseUUIDPipe;
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
