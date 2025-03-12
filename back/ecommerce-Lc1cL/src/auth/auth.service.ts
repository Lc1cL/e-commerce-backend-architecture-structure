import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from '../users/users.repository';
import { User } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRespository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async SignIn(email: string, password: string) {
    try {
      if (!email || !password)
        throw new BadRequestException('Email and password are required');

      const user = await this.userRespository.getUserByEmail(email);
      if (!user) throw new BadRequestException('Invalid email or password');

      const valildPassword = await bcrypt.compare(password, user.password);
      if (!valildPassword)
        throw new BadRequestException(`Invalid email or password`);

      const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Successfully logged in',
        token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error during SignIn:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }

  async signUp(user: Partial<User>) {
    try {
      const { email, password } = user;
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

      const foundUser = await this.userRespository.getUserByEmail(email);
      if (foundUser)
        throw new BadRequestException('This email is already registered');

      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.userRespository.createUser({
        ...user,
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error during SignUp:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }
}
