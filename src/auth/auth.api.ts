import express from 'express';
import AuthController from '../auth/auth.controller';
import AuthMiddleware from '../auth/auth.middleware';

const router = express.Router();

router.post('/register', AuthController.registration);
router.post('/login', AuthController.login);

export default router;
