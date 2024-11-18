import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import User from './User.entity';
  

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  // User who is part of the friendship
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // The friend they are associated with
  @ManyToOne(() => User)
  @JoinColumn({ name: 'friendId' })
  friend: User;

  // Timestamp for the friendship creation
  @CreateDateColumn()
  createdAt: Date;
}
