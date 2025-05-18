import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LibroDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  autor: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaPublicacion: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(97(8|9))?\d{9}(\d|X)$/, { message: 'isbn must be a valid ISBN-10 or ISBN-13' })
  isbn: string;
}
