import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { IChangePassword } from './interfaces/user.interface';
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  public getUsers() {
    return this.userService.getUsers();
  }

  @Post('user')
  public async createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Put('user/changePassword')
  public async changePassword(@Body() data: IChangePassword) {
    return this.userService.changePassword(data.email, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  public async getUserById(@Param('id') id: ParseUUIDPipe) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  public async deleteUserById(@Param('id') id: ParseUUIDPipe) {
    return this.userService.deleteUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/:id')
  public async updateUser(
    @Param('id') id: ParseUUIDPipe,
    @Body() user: UserDto,
  ) {
    return this.userService.updateUser(id, user);
  }
}
