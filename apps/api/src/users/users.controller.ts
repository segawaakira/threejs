import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { z } from 'zod';
import { ZodDto } from 'nestjs-zod';

const CreateUserInput = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      'Password must contain both letters and numbers',
    ),
});

// Simplicity - Just a simple controller to create and list users
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.listUsers();
  }

  @Post()
  async createUser(@Body() user: z.infer<typeof CreateUserInput>) {
    try {
      return await this.usersService.createUser(user.email, user.password);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'User with this email already exists'
      ) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }
      console.error('Create user error:', error);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('validate')
  async validate(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.validateUser(
      body.email,
      body.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  @Delete()
  deleteUser(@Body() body: { id: number }) {
    return this.usersService.deleteUser(body.id);
  }
}
