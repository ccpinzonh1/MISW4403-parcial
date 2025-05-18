import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';
import { LibroController } from './libro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LibroEntity])],
  providers: [LibroService],
  controllers: [LibroController],
})
export class LibroModule {}
