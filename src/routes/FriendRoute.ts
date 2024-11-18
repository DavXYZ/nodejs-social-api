import express from 'express';
import FriendController from '../controller/FriendController';
import verifyToken from '../auth/auth.middleware';

const router = express.Router();

// Send a friend request (protected route)
router.post('/send-request', verifyToken, FriendController.sendFriendRequest);

// View pending friend requests (protected route)
router.get('/requests', verifyToken, FriendController.getFriendRequests);

// View friends list (protected route)
router.get('/friends', verifyToken, FriendController.getFriends);

// Respond to a friend request (accept/decline) (protected route)
router.post('/respond-request', verifyToken, FriendController.respondToFriendRequest);

// Remove a friend from the friends list (protected route)
router.delete('/remove-friend', verifyToken, FriendController.removeFriend);

router.get('/search', verifyToken,FriendController.searchUsers);

export default router;
