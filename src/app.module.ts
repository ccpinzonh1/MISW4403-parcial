import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { LibroModule } from './libro/libro.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca/biblioteca.entity';
import { LibroEntity } from './libro/libro.entity';
import { BibliotecaLibroModule } from './biblioteca-libro/biblioteca-libro.module';

@Module({
  imports: [
    BibliotecaModule,
    LibroModule,
    BibliotecaLibroModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'biblioteca-db',
      entities: [LibroEntity, BibliotecaEntity],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
