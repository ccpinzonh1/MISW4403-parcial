import { Module } from '@nestjs/common';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaLibroController } from './biblioteca-libro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LibroEntity, BibliotecaEntity])],
  providers: [BibliotecaLibroService],
  controllers: [BibliotecaLibroController],
})
export class BibliotecaLibroModule {}
