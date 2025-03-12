import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number) {
    try {
      let users = await this.userRepository.find();

      const start = (page - 1) * limit;
      const end = start + limit;

      return users.slice(start, end).map(({ password, ...user }) => user);
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw new InternalServerErrorException('Could not retrieve users');
    }
  }

  async getById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: { orders: true },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const { password, isAdmin, ...userNoPass } = user;
      return userNoPass;
    } catch (error) {
      console.error('Error in getById:', error);
      throw new InternalServerErrorException('Could not retrieve user');
    }
  }

  async createUser(user: Partial<User>) {
    try {
      const dateUser = user.birthdate ? new Date(user.birthdate) : null;

      const newUser = await this.userRepository.save({
        birthdate: dateUser,
        ...user,
      });

      const { password, isAdmin, ...userNoPass } = newUser;
      return userNoPass;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new InternalServerErrorException(
        'Could not create user. Try again later',
      );
    }
  }

  async updateUser(id: string, user: User) {
    try {
      const foundUser = await this.userRepository.findOneBy({ id });
      if (!foundUser) {
        throw new NotFoundException(
          'User was not found and therefore not updated',
        );
      }

      const result = await this.userRepository.update(id, user);

      if (result.affected === 0) {
        throw new InternalServerErrorException(
          'User could not be updated. Try again later',
        );
      }

      const { password, isAdmin, ...userNoPass } = foundUser;
      return userNoPass;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async deleteById(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      await this.userRepository.remove(user);
      return `User with id ${id} was deleted successfully`;
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      throw new InternalServerErrorException('Could not delete user');
    }
  }

  getUserByEmail(email: string) {
    try {
      const userEmail = this.userRepository.findOne({ where: { email } });

      if (!userEmail) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return userEmail;
    } catch (error) {
      console.error(`Error getting user by email: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not retrieve user by email',
      );
    }
  }
}
