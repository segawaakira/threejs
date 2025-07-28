import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { IngredientsService } from './ingredient-set.service';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@Controller('ingredient-sets')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  // 材料セット作成
  @Post()
  async createIngredientSet(@Body() dto: CreateIngredientDto) {
    return this.ingredientsService.createIngredientSet(dto);
  }

  @Patch(':id')
  async updateIngredientSet(
    @Param('id') id: string,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.updateIngredientSet(Number(id), dto);
  }

  // ユーザーIDで材料セットを取得（履歴）
  @Get()
  async getUserIngredientSets(@Query('userId') userId: number) {
    return this.ingredientsService.getUserIngredientSets(Number(userId));
  }
}
