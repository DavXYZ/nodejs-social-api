import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import bcrypt from 'bcryptjs';
import {FriendRequest} from './FriendRequest.entity';
import {Friend} from './Friend.entity';

@Entity('users')
class AuthModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', unique: true })
    username?: string;

    @Column({ type: 'varchar' })
    password?: string;

    @Column({ type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ type: 'varchar', nullable: true })
    lastName?: string;

    @Column({ type: 'int' , nullable: true })
    age?: number;


    // Hash password utility
    static hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    static async findUserByUsername(username: string) {
        return this.findOne({ where: { username } });
    }

    // In AuthModel

static async areFriends(userId1: number, userId2: number): Promise<boolean> {
    const existingFriendship = await this.createQueryBuilder('user')
        .innerJoin('user.friends', 'friend', '(friend.userId = :userId1 AND friend.friendId = :userId2) OR (friend.userId = :userId2 AND friend.friendId = :userId1)', { userId1, userId2 })
        .getOne();

    return existingFriendship !== undefined;
}


    // Relationships for Friend Requests and Friendships

    // Sent Friend Requests
    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
    sentRequests: FriendRequest[];

    // Received Friend Requests
    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
    receivedRequests: FriendRequest[];

    // Confirmed Friendships
    @OneToMany(() => Friend, (friend) => friend.user)
    friends: Friend[];
}

export default AuthModel;
