import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let libroRepository: Repository<LibroEntity>;
  let bibliotecaRepository: Repository<BibliotecaEntity>;
  let libroList: LibroEntity[];
  let bibliotecaList: BibliotecaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaLibroService],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
    libroRepository = module.get<Repository<LibroEntity>>(
      getRepositoryToken(LibroEntity),
    );
    bibliotecaRepository = module.get<Repository<BibliotecaEntity>>(
      getRepositoryToken(BibliotecaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await libroRepository.clear();
    await bibliotecaRepository.clear();

    libroList = [];
    bibliotecaList = [];

    for (let i = 0; i < 5; i++) {
      const libro: LibroEntity = await libroRepository.save({
        titulo: faker.word.words(),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        isbn: faker.string.uuid(),
      });
      libroList.push(libro);

      const biblioteca: BibliotecaEntity = await bibliotecaRepository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.city(),
        horaApertura: '07:00:00',
        horaCierre: '20:00:00',
      });
      bibliotecaList.push(biblioteca);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addBookToLibrary should add a libro to a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    const libro = libroList[0];

    const updatedBiblioteca = await service.addBookToLibrary(
      biblioteca.id,
      libro.id,
    );

    expect(updatedBiblioteca.libros).toContainEqual(libro);
  });

  it('addBookToLibrary should throw an exception for an invalid biblioteca ID', async () => {
    const libro = libroList[0];
    await expect(
      service.addBookToLibrary('0', libro.id),
    ).rejects.toHaveProperty('message', 'Biblioteca with ID 0 not found');
  });

  it('addBookToLibrary should throw an exception for an invalid libro ID', async () => {
    const biblioteca = bibliotecaList[0];
    await expect(
      service.addBookToLibrary(biblioteca.id, '0'),
    ).rejects.toHaveProperty('message', 'Libro with ID 0 not found');
  });

  it('findBooksFromLibrary should return libros from a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    const libro = libroList[0];
    const libro2 = libroList[1];

    await service.addBookToLibrary(biblioteca.id, libro.id);
    await service.addBookToLibrary(biblioteca.id, libro2.id);
    const libros = await service.findBooksFromLibrary(biblioteca.id);

    expect(libros).not.toBeNull();
    expect(libros).toHaveLength(2);
    expect(libros).toContainEqual(libro);
    expect(libros).toContainEqual(libro2);
  });

  it('findBooksFromLibrary should throw an exception for an invalid biblioteca ID', async () => {
    await expect(service.findBooksFromLibrary('0')).rejects.toHaveProperty(
      'message',
      'Biblioteca with ID 0 not found',
    );
  });

  it('findBookFromLibrary should return a libro from a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    const libro = libroList[0];

    await service.addBookToLibrary(biblioteca.id, libro.id);

    const storedLibro = await service.findBookFromLibrary(
      biblioteca.id,
      libro.id,
    );

    expect(storedLibro).not.toBeNull();
    expect(storedLibro.id).toEqual(libro.id);
  });

  it('findBookFromLibrary should throw an exception for an invalid biblioteca ID', async () => {
    const libro = libroList[0];
    await expect(
      service.findBookFromLibrary('0', libro.id),
    ).rejects.toHaveProperty('message', 'Biblioteca with ID 0 not found');
  });

  it('findBookFromLibrary should throw an exception for an invalid libro ID', async () => {
    const biblioteca = bibliotecaList[0];
    await expect(
      service.findBookFromLibrary(biblioteca.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      `Libro with ID 0 not found in Biblioteca with ID ${biblioteca.id}`,
    );
  });

  it('updateBooksFromLibrary should update libros in a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    const libros = [libroList[0], libroList[1]];

    const updatedBiblioteca = await service.updateBooksFromLibrary(
      biblioteca.id,
      libros,
    );

    expect(updatedBiblioteca.libros).toHaveLength(libros.length);
    expect(updatedBiblioteca.libros).toEqual(expect.arrayContaining(libros));
  });

  it('updateBooksFromLibrary should throw an exception for an invalid biblioteca ID', async () => {
    const libros = [libroList[0], libroList[1]];
    await expect(
      service.updateBooksFromLibrary('0', libros),
    ).rejects.toHaveProperty('message', 'Biblioteca with ID 0 not found');
  });

  it('updateBooksFromLibrary should throw an exception for invalid libro IDs', async () => {
    const biblioteca = bibliotecaList[0];
    const invalidLibro = { ...libroList[0], id: '0' };
    const libros = [invalidLibro];

    await expect(
      service.updateBooksFromLibrary(biblioteca.id, libros),
    ).rejects.toHaveProperty('message', 'Some libros not found');
  });

  it('deleteBookFromLibrary should remove a libro from a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    const libro = libroList[0];

    await service.addBookToLibrary(biblioteca.id, libro.id);
    await service.deleteBookFromLibrary(biblioteca.id, libro.id);

    const libros = await service.findBooksFromLibrary(biblioteca.id);
    expect(libros).not.toContainEqual(libro);
  });

  it('deleteBookFromLibrary should throw an exception for an invalid biblioteca ID', async () => {
    const libro = libroList[0];
    await expect(
      service.deleteBookFromLibrary('0', libro.id),
    ).rejects.toHaveProperty('message', 'Biblioteca with ID 0 not found');
  });

  it('deleteBookFromLibrary should throw an exception for an invalid libro ID', async () => {
    const biblioteca = bibliotecaList[0];
    await expect(
      service.deleteBookFromLibrary(biblioteca.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      `Libro with ID 0 not found in Biblioteca with ID ${biblioteca.id}`,
    );
  });
});
