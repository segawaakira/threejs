import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

// Simplicity - Just a simple service to create and list users
@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createIngredientSet(dto: CreateIngredientDto) {
    return this.prisma.ingredientSet.create({
      data: {
        ingredients: dto.ingredients,
        user: {
          connect: { id: dto.userId },
        },
      },
    });
  }

  async updateIngredientSet(id: number, dto: UpdateIngredientDto) {
    console.log(' =======id======');
    console.log(id);
    return this.prisma.ingredientSet.update({
      where: { userId: id },
      data: {
        ingredients: dto.ingredients,
      },
    });
  }

  async getUserIngredientSets(userId: number) {
    return this.prisma.ingredientSet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
