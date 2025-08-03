import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

// Type definition for Prisma client
interface PrismaClientType {
  user: any;
  ingredientSet: any;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public prisma: PrismaClientType;

  constructor() {
    // Dynamic import to avoid TypeScript issues
    this.prisma = new (require('@prisma/client').PrismaClient)({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.prisma.$disconnect();
  }
}
