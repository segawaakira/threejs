import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { IngredientsModule } from './ingredient-set/ingredient-set.module';

@Module({
  imports: [PrismaModule, UsersModule, IngredientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
