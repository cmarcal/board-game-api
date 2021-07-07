import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}
