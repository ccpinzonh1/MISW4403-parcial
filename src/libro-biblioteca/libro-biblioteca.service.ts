import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class LibroBibliotecaService {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
  ) {}

  async addBookToLibrary(
    bibliotecaId: string,
    libroId: string,
  ): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        `Biblioteca with ID ${bibliotecaId} not found`,
        BusinessError.NOT_FOUND,
      );

    const libro = await this.libroRepository.findOne({
      where: { id: libroId },
    });
    if (!libro)
      throw new BusinessLogicException(
        `Libro with ID ${libroId} not found`,
        BusinessError.NOT_FOUND,
      );

    biblioteca.libros.push(libro);
    return this.bibliotecaRepository.save(biblioteca);
  }

  async findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        `Biblioteca with ID ${bibliotecaId} not found`,
        BusinessError.NOT_FOUND,
      );

    return biblioteca.libros;
  }

  async findBookFromLibrary(
    bibliotecaId: string,
    libroId: string,
  ): Promise<LibroEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        `Biblioteca with ID ${bibliotecaId} not found`,
        BusinessError.NOT_FOUND,
      );

    const libro = biblioteca.libros.find((libro) => libro.id === libroId);
    if (!libro)
      throw new BusinessLogicException(
        `Libro with ID ${libroId} not found in Biblioteca with ID ${bibliotecaId}`,
        BusinessError.NOT_FOUND,
      );

    return libro;
  }

  async updateBooksFromLibrary(
    bibliotecaId: string,
    libros: LibroEntity[],
  ): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        `Biblioteca with ID ${bibliotecaId} not found`,
        BusinessError.NOT_FOUND,
      );

    const librosExistentes = await this.libroRepository.findBy({
      id: In(libros.map((libro) => libro.id)),
    });
    if (librosExistentes.length !== libros.length)
      throw new BusinessLogicException(
        `Some libros not found`,
        BusinessError.NOT_FOUND,
      );

    biblioteca.libros = librosExistentes;
    return this.bibliotecaRepository.save(biblioteca);
  }

  async deleteBookFromLibrary(
    bibliotecaId: string,
    libroId: string,
  ): Promise<void> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        `Biblioteca with ID ${bibliotecaId} not found`,
        BusinessError.NOT_FOUND,
      );

    const libroIndex = biblioteca.libros.findIndex(
      (libro) => libro.id === libroId,
    );
    if (libroIndex === -1)
      throw new BusinessLogicException(
        `Libro with ID ${libroId} not found in Biblioteca with ID ${bibliotecaId}`,
        BusinessError.NOT_FOUND,
      );

    biblioteca.libros.splice(libroIndex, 1);
    await this.bibliotecaRepository.save(biblioteca);
  }
}
