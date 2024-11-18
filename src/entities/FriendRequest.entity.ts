import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  import User from './User.entity';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // Sender user
  @ManyToOne(() => User, (user) => user.sentRequests)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  // Receiver user
  @ManyToOne(() => User, (user) => user.receivedRequests)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  // Status of the friend request (pending, accepted, or declined)
  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  // Timestamp for the request
  @CreateDateColumn()
  createdAt: Date;

  // Optional: Track the time when the request was last updated
  @CreateDateColumn()
  updatedAt: Date;
}
