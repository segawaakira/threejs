import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Simplicity - Just a simple service to create and list users
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return user;
  }

  async listUsers() {
    const users = await this.prisma.user.findMany();

    if (!users) {
      throw new NotFoundException(`No users found`);
    }

    return users;
  }
}
