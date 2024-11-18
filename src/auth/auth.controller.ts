import { Request, Response, NextFunction } from 'express';
import AuthService from './auth.service';
import SuccessHandlerUtil from '../utils/success-handler.util';

export default class AuthController {
    static async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName,lastName,age, username, password } = req.body;
            const register = await AuthService.registration(firstName,lastName,age, username, password);
            SuccessHandlerUtil.handleAdd(res, next, register);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const login = await AuthService.login(username, password);
            SuccessHandlerUtil.handleAdd(res, next, login);
        } catch (error) {
            next(error);
        }
    }
}
