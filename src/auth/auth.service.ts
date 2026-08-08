import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
    });

    const token = await this.signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    const token = await this.signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  private signToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
