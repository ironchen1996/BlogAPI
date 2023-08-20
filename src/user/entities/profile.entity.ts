import { Expose } from 'class-transformer';
import { Gender } from '../../enum/gender.enum';
import { User } from './user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  avatar: string;

  @Column({ nullable: false })
  nickname: string;

  // @Column({
  //   type: 'enum',
  //   enum: Gender,
  //   default: Gender.UNKNOWN,
  // })
  // gender: Gender;

  // @Column({ type: 'date', nullable: true })
  // birthday: Date;

  @Column({ length: 300, nullable: false })
  introduction: string;

  @Column({ nullable: true })
  GitHub: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  LinkedIn: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Expose()
  user: User;
}
