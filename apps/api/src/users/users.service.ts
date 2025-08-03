import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Simplicity - Just a simple service to create and list users
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.prisma.user.findUnique({ where: { email } });
    console.log(' =======user========');
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, email: user.email };
    }
    return null;
  }

  async createUser(email: string, password: string) {
    try {
      // 既存のユーザーをチェック
      const existingUser = await this.prisma.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async listUsers() {
    const users = await this.prisma.prisma.user.findMany();

    if (!users) {
      throw new NotFoundException(`No users found`);
    }

    return users;
  }

  async deleteUser(id: number) {
    // ユーザーが存在するかチェック
    const user = await this.prisma.prisma.user.findUnique({
      where: { id },
      include: { ingredientSets: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 関連データ（IngredientSet）も含めて削除
    await this.prisma.prisma.user.delete({
      where: { id },
      include: { ingredientSets: true },
    });

    return { message: 'User and associated data deleted successfully' };
  }
}
