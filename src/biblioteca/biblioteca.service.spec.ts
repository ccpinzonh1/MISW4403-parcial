import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from './biblioteca.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repository: Repository<BibliotecaEntity>;
  let bibliotecaList: BibliotecaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaService],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    repository = module.get<Repository<BibliotecaEntity>>(
      getRepositoryToken(BibliotecaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    bibliotecaList = [];
    for (let i = 0; i < 5; i++) {
      const biblioteca: BibliotecaEntity = await repository.save({
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

  it('findAll should return all bibliotecas', async () => {
    const bibliotecas = await service.findAll();
    expect(bibliotecas).not.toBeNull();
    expect(bibliotecas).toHaveLength(bibliotecaList.length);
  });

  it('findOne should return a biblioteca by ID', async () => {
    const storedBiblioteca = bibliotecaList[0];
    const biblioteca = await service.findOne(storedBiblioteca.id);
    expect(biblioteca).not.toBeNull();
    expect(biblioteca.nombre).toEqual(storedBiblioteca.nombre);
  });

  it('findOne should throw an exception for an invalid ID', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Biblioteca with ID 0 not found',
    );
  });

  it('create should create a new biblioteca', async () => {
    const biblioteca: BibliotecaEntity = {
      id: '',
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horaApertura: '07:00:00',
      horaCierre: '20:00:00',
      libros: [],
    };

    const newBiblioteca = await service.create(biblioteca);
    expect(newBiblioteca).not.toBeNull();

    const storedBiblioteca = await repository.findOne({
      where: { id: newBiblioteca.id },
    });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca!.nombre).toEqual(newBiblioteca.nombre);
  });

  it('create should throw an exception for invalid time range', async () => {
    const biblioteca: BibliotecaEntity = {
      id: '',
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horaApertura: '20:00:00',
      horaCierre: '07:00:00',
      libros: [],
    };

    await expect(service.create(biblioteca)).rejects.toHaveProperty(
      'message',
      'Hora de apertura debe ser menor a la hora de cierre',
    );
  });

  it('update should modify a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    biblioteca.nombre = 'Updated Name';
    const updatedBiblioteca = await service.update(biblioteca.id, biblioteca);
    expect(updatedBiblioteca).not.toBeNull();

    const storedBiblioteca = await repository.findOne({
      where: { id: biblioteca.id },
    });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca!.nombre).toEqual(biblioteca.nombre);
  });

  it('update should throw an exception for invalid time range', async () => {
    const biblioteca = bibliotecaList[0];
    biblioteca.horaApertura = '20:00:00';
    biblioteca.horaCierre = '07:00:00';
    await expect(
      service.update(biblioteca.id, biblioteca),
    ).rejects.toHaveProperty(
      'message',
      'Hora de apertura debe ser menor a la hora de cierre',
    );
  });

  it('update should throw an exception for an invalid ID', async () => {
    const biblioteca = bibliotecaList[0];
    biblioteca.nombre = 'Updated Name';
    await expect(service.update('0', biblioteca)).rejects.toHaveProperty(
      'message',
      'Biblioteca with ID 0 not found',
    );
  });

  it('delete should remove a biblioteca', async () => {
    const biblioteca = bibliotecaList[0];
    await service.delete(biblioteca.id);

    const deletedBiblioteca = await repository.findOne({
      where: { id: biblioteca.id },
    });
    expect(deletedBiblioteca).toBeNull();
  });

  it('delete should throw an exception for an invalid ID', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'Biblioteca with ID 0 not found',
    );
  });
});
