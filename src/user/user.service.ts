import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { UserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';

import * as bcrypt from 'bcrypt';
import { exception } from 'console';

const userProjection = {
  __v: false,
  _id: false,
  password: false,
};

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async getUsers(): Promise<Omit<UserDto, 'password'>[]> {
    const users = await this.userModel.find({}, userProjection).exec();

    return users;
  }

  async createUser(newUser: Omit<UserDto, 'id'>) {
    const uuid = uuidv4();
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    const { email, name } = newUser;

    const emailAlreadyExists = await this.userModel.findOne({ email }).exec();
    if (emailAlreadyExists) throw new ConflictException();

    const user = new this.userModel({
      name,
      email,
      password: hashPassword,
      id: uuid,
    });
    return user.save();
  }

  async getUserById(userid: ParseUUIDPipe): Promise<Omit<UserDto, 'password'>> {
    const user = await this.userModel
      .findOne({ id: userid }, userProjection)
      .exec();

    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async deleteUserById(id: ParseUUIDPipe): Promise<string> {
    const user = await this.userModel.deleteOne({ id }).exec();

    if (user.deletedCount === 0)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return 'success_deleted';
  }

  async updateUser(id: ParseUUIDPipe, newUser: UserDto): Promise<UserDto> {
    const user = await this.userModel
      .findOneAndUpdate({ id }, { ...newUser }, { projection: userProjection })
      .exec();

    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async changePassword(email: string, newPassword): Promise<string> {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { email },
          { password: hashPassword },
          { projection: userProjection },
        )
        .exec();
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      return 'password_changed';
    } catch (error) {
      throw new InternalServerErrorException('Internal Error');
    }
  }
}
