import { AppDataSource } from '../data-source';
import User from '../entities/User.entity';
import { FriendRequest } from '../entities/FriendRequest.entity';
import { Friend } from '../entities/Friend.entity';

class FriendService {
  async sendFriendRequest(senderId: number, receiverId: number) {
    const userRepository = AppDataSource.getRepository(User);
    const friendRequestRepository = AppDataSource.getRepository(FriendRequest);

    const sender = await userRepository.findOne({ where: { id: senderId } });
    const receiver = await userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    const existingRequest = await friendRequestRepository.findOne({
      where: { sender: sender, receiver: receiver },
    });

    if (existingRequest) {
      throw new Error('Request already sent');
    }

    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;
    await friendRequestRepository.save(friendRequest);

    return 'Friend request sent';
  }

  async getFriendRequests(userId: number) {
    const friendRequestRepository = AppDataSource.getRepository(FriendRequest);

    const requests = await friendRequestRepository.find({
      where: { receiver: { id: userId }, status: 'pending' },
      relations: ['sender'],
    });

    return requests.map(request => ({
      requestId: request.id,
      senderId: request.sender.id,
      senderFirstName: request.sender.firstName,
      senderLastName: request.sender.lastName,
      senderUsername: request.sender.username,
      status: request.status,
    }));
  }

  async getFriends(userId: number) {
    const friendRepository = AppDataSource.getRepository(Friend);
    const friends = await friendRepository.find({
      where: { user: { id: userId } },
      relations: ['friend'],
    });

    return friends.map(friend => ({
      friendId: friend.friend.id,
      friendUsername: friend.friend.username,
      friendFirstName: friend.friend.firstName,
      friendLastName: friend.friend.lastName,
      friendAge: friend.friend.age,
    }));
  }

  async respondToFriendRequest(senderId: number, receiverId: number, status: 'accepted' | 'declined') {
    const friendRequestRepository = AppDataSource.getRepository(FriendRequest);
    const friendRepository = AppDataSource.getRepository(Friend);

    const request = await friendRequestRepository.findOne({
      where: { sender: { id: senderId }, receiver: { id: receiverId } },
      relations: ['sender', 'receiver'],
    });

    if (!request) {
      throw new Error('Friend request not found');
    }

    if (status === 'accepted') {
      const friend1 = new Friend();
      friend1.user = request.sender;
      friend1.friend = request.receiver;

      const friend2 = new Friend();
      friend2.user = request.receiver;
      friend2.friend = request.sender;

      await friendRepository.save([friend1, friend2]);
    }
    await friendRequestRepository.remove(request);
    return `Friend request ${status}`;
  }

  async removeFriend(userId: number, friendId: number) {
    const friendRepository = AppDataSource.getRepository(Friend);
    const friendships = await friendRepository.find({
      where: [
        { user: { id: userId }, friend: { id: friendId } },
        { user: { id: friendId }, friend: { id: userId } },
      ],
    });

    if (friendships.length === 0) {
      throw new Error('Friendship not found');
    }
    await friendRepository.remove(friendships);

    return 'Friend removed successfully';
  }

  async searchUsers(criteria: { firstName?: string; lastName?: string; age?: number }) {
    const userRepository = AppDataSource.getRepository(User);
    const queryBuilder = userRepository.createQueryBuilder("user");

    if (criteria.firstName) {
      queryBuilder.andWhere("user.firstName ILIKE :firstName", { firstName: `%${criteria.firstName}%` });
    }
    if (criteria.lastName) {
      queryBuilder.andWhere("user.lastName ILIKE :lastName", { lastName: `%${criteria.lastName}%` });
    }
    if (criteria.age) {
      queryBuilder.andWhere("user.age = :age", { age: criteria.age });
    }

    const users = await queryBuilder.getMany();
    return users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      age: user.age,
    }));
  }

}

export default new FriendService();
