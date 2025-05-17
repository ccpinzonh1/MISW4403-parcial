import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class BibliotecaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'La hora de apertura debe estar en formato HH:mm:ss',
  })
  readonly horaApertura: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'La hora de cierre debe estar en formato HH:mm:ss',
  })
  readonly horaCierre: string;
}
