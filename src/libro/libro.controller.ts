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
import { LibroService } from './libro.service';
import { LibroEntity } from './libro.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { LibroDto } from './libro.dto';
import { pl } from '@faker-js/faker/.';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('books')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Get()
  async findAll() {
    return await this.libroService.findAll();
  }

  @Get(':libroId')
  async findOne(@Param('libroId') libroId: string) {
    return await this.libroService.findOne(libroId);
  }

  @Post()
  async create(@Body() libroDto: LibroDto) {
    const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
    return await this.libroService.create(libro);
  }

  @Put(':libroId')
  async update(@Param('libroId') libroId: string, @Body() libroDto: LibroDto) {
    const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
    return await this.libroService.update(libroId, libro);
  }

  @Delete(':libroId')
  async delete(@Param('libroId') libroId: string) {
    return await this.libroService.delete(libroId);
  }
}
