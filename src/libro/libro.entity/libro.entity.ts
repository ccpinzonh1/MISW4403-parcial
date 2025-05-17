import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class LibroEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  titulo: string;
  @Column()
  autor: string;
  @Column()
  fechaPublicacion: Date;
  @Column()
  isbn: string;
}
