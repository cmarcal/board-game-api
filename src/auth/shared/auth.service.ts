import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../../user/user.service';
import { IUserAuthentication } from '../interfaces/userAuthentication.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userEmail: string,
    userPassword: string,
  ): Promise<IUserAuthentication> {
    const user = await this.userService.getUserByEmail(userEmail);
    const samePassword = await bcrypt.compare(userPassword, user.password);

    if (user && samePassword) {
      const { name, id, email } = user;
      return { id, name, email };
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
