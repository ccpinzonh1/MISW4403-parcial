import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibroEntity } from './libro.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async findAll(): Promise<LibroEntity[]> {
    return this.libroRepository.find({ relations: ['bibliotecas'] });
  }

  async findOne(id: string): Promise<LibroEntity> {
    const libro = await this.libroRepository.findOne({
      where: { id },
      relations: ['bibliotecas'],
    });
    if (!libro) {
      throw new BusinessLogicException(
        `Libro with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return libro;
  }

  async create(libro: LibroEntity): Promise<LibroEntity> {
    if (libro.fechaPublicacion > new Date()) {
      throw new BusinessLogicException(
        'La fecha de publicación debe ser anterior o igual a la fecha actual.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return this.libroRepository.save(libro);
  }

  async update(id: string, libro: LibroEntity): Promise<LibroEntity> {
    const existingLibro = await this.findOne(id);
    if (libro.fechaPublicacion > new Date()) {
      throw new BusinessLogicException(
        'La fecha de publicación debe ser anterior o igual a la fecha actual.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const updatedLibro = { ...existingLibro, ...libro };
    return this.libroRepository.save(updatedLibro);
  }

  async delete(id: string): Promise<void> {
    const libro = await this.findOne(id);
    await this.libroRepository.remove(libro);
  }
}
