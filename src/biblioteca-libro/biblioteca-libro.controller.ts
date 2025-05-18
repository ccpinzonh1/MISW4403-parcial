import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { LibroEntity } from '../libro/libro.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { LibroDto } from 'src/libro/libro.dto';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('libraries/:bibliotecaId/books')
export class BibliotecaLibroController {
  constructor(
    private readonly bibliotecaLibroService: BibliotecaLibroService,
  ) {}

  @Post(':libroId')
  async addBookToLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string,
  ) {
    return await this.bibliotecaLibroService.addBookToLibrary(
      bibliotecaId,
      libroId,
    );
  }

  @Get()
  async findBooksFromLibrary(@Param('bibliotecaId') bibliotecaId: string) {
    return await this.bibliotecaLibroService.findBooksFromLibrary(bibliotecaId);
  }

  @Get(':libroId')
  async findBookFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string,
  ) {
    return await this.bibliotecaLibroService.findBookFromLibrary(
      bibliotecaId,
      libroId,
    );
  }

  @Put()
  async updateBooksFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Body() librosDto: LibroDto[],
  ) {
    const libros: LibroEntity[] = librosDto.map((libroDto) =>
      plainToInstance(LibroEntity, libroDto),
    );
    return await this.bibliotecaLibroService.updateBooksFromLibrary(
      bibliotecaId,
      libros,
    );
  }

  @Delete(':libroId')
  async deleteBookFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string,
  ) {
    return await this.bibliotecaLibroService.deleteBookFromLibrary(
      bibliotecaId,
      libroId,
    );
  }
}
