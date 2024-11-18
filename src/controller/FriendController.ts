import { Request, Response } from 'express';
import FriendService from '../services/FriendService';

interface CustomRequest extends Request {
  userId?: number;
}

class FriendController {
  // Send a friend request
  async sendFriendRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const senderId = req.userId;
      const { receiverId } = req.body;
      
      if (!senderId || !receiverId) {
        res.status(400).json({ message: 'Sender and receiver IDs are required' });
        return;
      }

      const message = await FriendService.sendFriendRequest(Number(senderId), receiverId);
      res.status(201).json({ message });
    } catch (error: unknown) {
      console.log(error);
      
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  // View pending friend requests
  async getFriendRequests(req: CustomRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      const requests = await FriendService.getFriendRequests(Number(userId));
      res.status(200).json(requests);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  // View friends list
  async getFriends(req: CustomRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      const friends = await FriendService.getFriends(Number(userId));
      res.status(200).json(friends);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  // Respond to a friend request
  async respondToFriendRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const receiverId = req.userId;
      const { senderId, status } = req.body;

      if (!receiverId || !senderId || !status) {
        res.status(400).json({ message: 'Sender ID, receiver ID, and status are required' });
        return 
      }

      const message = await FriendService.respondToFriendRequest(senderId, receiverId, status);
      res.status(200).json({ message });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  // Remove a friend from the friends list
  async removeFriend(req: CustomRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { friendId } = req.body;

      if (!userId || !friendId) {
        res.status(400).json({ message: 'Both user and friend IDs are required' });
        return;
      }

      const message = await FriendService.removeFriend(Number(userId), friendId);
      res.status(200).json({ message });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  // Search for users
  async searchUsers(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { firstName, lastName, age } = req.query;
      const criteria = {
        firstName: firstName?.toString(),
        lastName: lastName?.toString(),
        age: age ? parseInt(age.toString()) : undefined,
      };

      const users = await FriendService.searchUsers(criteria);
      res.status(200).json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}

export default new FriendController();
