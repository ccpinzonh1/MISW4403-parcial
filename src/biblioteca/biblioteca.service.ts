import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
  ) {}

  async findAll(): Promise<BibliotecaEntity[]> {
    return this.bibliotecaRepository.find({ relations: ['libros'] });
  }

  async findOne(id: string): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id },
      relations: ['libros'],
    });
    if (!biblioteca) {
      throw new BusinessLogicException(
        `Biblioteca with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return biblioteca;
  }

  async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    if (
      biblioteca.horaApertura &&
      biblioteca.horaCierre &&
      !this.isValidTimeRange(biblioteca.horaApertura, biblioteca.horaCierre)
    ) {
      throw new BusinessLogicException(
        'Hora de apertura debe ser menor a la hora de cierre',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return this.bibliotecaRepository.save(biblioteca);
  }

  async update(
    id: string,
    biblioteca: Partial<BibliotecaEntity>,
  ): Promise<BibliotecaEntity> {
    const existingBiblioteca = await this.findOne(id);
    if (
      biblioteca.horaApertura &&
      biblioteca.horaCierre &&
      !this.isValidTimeRange(biblioteca.horaApertura, biblioteca.horaCierre)
    ) {
      throw new BusinessLogicException(
        'Hora de apertura debe ser menor a la hora de cierre',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    Object.assign(existingBiblioteca, biblioteca);
    return this.bibliotecaRepository.save(existingBiblioteca);
  }

  async delete(id: string): Promise<void> {
    const biblioteca = await this.findOne(id);
    await this.bibliotecaRepository.remove(biblioteca);
  }

  private isValidTimeRange(horaApertura: string, horaCierre: string): boolean {
    const apertura = moment(horaApertura, 'HH:mm', true);
    const cierre = moment(horaCierre, 'HH:mm', true);
    return apertura.isValid() && cierre.isValid() && apertura.isBefore(cierre);
  }
}
