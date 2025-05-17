import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { LibroEntity } from './libro.entity/libro.entity';

describe('LibroService', () => {
  let service: LibroService;
  let repository: Repository<LibroEntity>;
  let libroList: LibroEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibroService],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repository = module.get<Repository<LibroEntity>>(
      getRepositoryToken(LibroEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    libroList = [];
    for (let i = 0; i < 5; i++) {
      const libro: LibroEntity = await repository.save({
        titulo: faker.word.words(),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        isbn: faker.string.uuid(),
        bibliotecas: [],
      });
      libroList.push(libro);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all libros', async () => {
    const libros = await service.findAll();
    expect(libros).not.toBeNull();
    expect(libros).toHaveLength(libroList.length);
  });

  it('findOne should return a libro by ID', async () => {
    const storedLibro = libroList[0];
    const libro = await service.findOne(storedLibro.id);
    expect(libro).not.toBeNull();
    expect(libro.id).toEqual(storedLibro.id);
    expect(libro.titulo).toEqual(storedLibro.titulo);
  });

  it('findOne should throw an exception for an invalid ID', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Libro with ID 0 not found',
    );
  });

  it('create should return a new libro', async () => {
    const libro: LibroEntity = {
      id: '',
      titulo: faker.word.words(),
      autor: faker.person.fullName(),
      fechaPublicacion: faker.date.past(),
      isbn: faker.string.uuid(),
      bibliotecas: [],
    };

    const newLibro = await service.create(libro);
    expect(newLibro).not.toBeNull();

    const storedLibro = await repository.findOne({
      where: { id: newLibro.id },
    });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro!.titulo).toEqual(newLibro.titulo);
  });

  it('create should throw an exception for a future publication date', async () => {
    const libro: LibroEntity = {
      id: '',
      titulo: faker.word.words(),
      autor: faker.person.fullName(),
      fechaPublicacion: faker.date.future(),
      isbn: faker.string.uuid(),
      bibliotecas: [],
    };

    await expect(service.create(libro)).rejects.toHaveProperty(
      'message',
      'La fecha de publicación debe ser anterior o igual a la fecha actual.',
    );
  });

  it('update should modify an existing libro', async () => {
    const libro = libroList[0];
    libro.titulo = 'Updated Title';

    const updatedLibro = await service.update(libro.id, libro);
    expect(updatedLibro).not.toBeNull();

    const storedLibro = await repository.findOne({ where: { id: libro.id } });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro!.titulo).toEqual(libro.titulo);
  });

  it('update should throw an exception for an invalid ID', async () => {
    const libro = libroList[0];
    libro.titulo = 'Updated Title';

    await expect(service.update('0', libro)).rejects.toHaveProperty(
      'message',
      'Libro with ID 0 not found',
    );
  });

  it('update should throw an exception for a future publication date', async () => {
    const libro = libroList[0];
    libro.fechaPublicacion = faker.date.future();

    await expect(service.update(libro.id, libro)).rejects.toHaveProperty(
      'message',
      'La fecha de publicación debe ser anterior o igual a la fecha actual.',
    );
  });

  it('delete should remove a libro', async () => {
    const libro = libroList[0];
    await service.delete(libro.id);

    const deletedLibro = await repository.findOne({ where: { id: libro.id } });
    expect(deletedLibro).toBeNull();
  });

  it('delete should throw an exception for an invalid ID', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'Libro with ID 0 not found',
    );
  });
});
