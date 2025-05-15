import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BibliotecaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  direccion: string;
  @Column()
  ciudad: string;
  @Column({ type: 'time' })
  horaApertura: string;
  @Column({ type: 'time' })
  horaCierre: string;
}
