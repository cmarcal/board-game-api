import { ParseUUIDPipe } from '@nestjs/common';
import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly id: ParseUUIDPipe;
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
