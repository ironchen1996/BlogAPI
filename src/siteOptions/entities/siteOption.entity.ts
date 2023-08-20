import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class siteOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logo: string;

  @Column()
  logoDiscribe: string;

  @Column()
  footerInfo: string;
}
