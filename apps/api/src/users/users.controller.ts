import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

// Simplicity - Just a simple controller to create and list users
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.listUsers();
  }

  @Post()
  createUser(@Body() user: { email: string; password: string }) {
    return this.usersService.createUser(user.email, user.password);
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
