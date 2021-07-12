import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { UserDto } from './user.dto';

const userProjection = {
  __v: false,
  _id: false,
};

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async getUsers(): Promise<UserDto[]> {
    const users = await this.userModel.find({}, userProjection).exec();

    if (!users || !users[0])
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return users;
  }

  async createUser(newUser: UserDto) {
    const user = new this.userModel(newUser);
    return user.save();
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.userModel.findOne({ id }, userProjection).exec();

    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ email }, userProjection).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async deleteUserById(id: number): Promise<any> {
    const user = await this.userModel.deleteOne({ id }).exec();

    if (user.deletedCount === 0)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async updateUser(id: number, newUser: UserDto): Promise<UserDto> {
    const user = await this.userModel
      .findOneAndUpdate({ id }, { ...newUser })
      .exec();

    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return user;
  }
}
