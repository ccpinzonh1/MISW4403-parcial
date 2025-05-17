import { Module } from '@nestjs/common';
import { LibroBibliotecaService } from './libro-biblioteca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibroEntity, BibliotecaEntity])],
  providers: [LibroBibliotecaService],
})
export class LibroBibliotecaModule {}
