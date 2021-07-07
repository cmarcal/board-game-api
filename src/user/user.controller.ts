import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  public async createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Get(':id')
  public async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  public async deleteUserById(@Param('id') id: number) {
    return this.userService.deleteUserById(id);
  }

  @Put(':id')
  public async updateUser(@Param('id') id: number, @Body() user: UserDto) {
    return this.userService.updateUser(id, user);
  }
}
