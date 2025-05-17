import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaDto } from './biblioteca.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('libraries')
export class BibliotecaController {
  constructor(private readonly bibliotecaService: BibliotecaService) {}

  @Get()
  async findAll() {
    return await this.bibliotecaService.findAll();
  }

  @Get(':bibliotecaId')
  async findOne(@Param('bibliotecaId') bibliotecaId: string) {
    return await this.bibliotecaService.findOne(bibliotecaId);
  }

  @Post()
  async create(@Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca: BibliotecaEntity = plainToInstance(
      BibliotecaEntity,
      bibliotecaDto,
    );
    return await this.bibliotecaService.create(biblioteca);
  }

  @Put(':bibliotecaId')
  async update(
    @Param('bibliotecaId') bibliotecaId: string,
    @Body() bibliotecaDto: BibliotecaDto,
  ) {
    const biblioteca: BibliotecaEntity = plainToInstance(
      BibliotecaEntity,
      bibliotecaDto,
    );
    return await this.bibliotecaService.update(bibliotecaId, biblioteca);
  }

  @Delete(':bibliotecaId')
  async delete(@Param('bibliotecaId') bibliotecaId: string) {
    return await this.bibliotecaService.delete(bibliotecaId);
  }
}
