import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Simplicity - Just a simple service to create and list users
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    console.log(' =======user========');
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, email: user.email };
    }
    return null;
  }

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
