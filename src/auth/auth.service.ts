import ErrorsUtil from '../utils/errors.util';
import HttpStatusCodesUtil from '../utils/http-status-codes.util';
import CryptoUtil from '../utils/crypto.util';
import AuthModel from '../entities/User.entity';
import jwt from 'jsonwebtoken';

const { InputValidationError, UnauthorizedError } = ErrorsUtil;


class AuthService {
    static async registration(firstName: string, lastName:string,age:number, username: string, password: string) {

        const existingUser = await AuthModel.findOne({ where: { username } });
        if (existingUser) {
            throw new InputValidationError('Username is already taken', HttpStatusCodesUtil.BAD_REQUEST);
        }

        const hashedPassword = CryptoUtil.createHash(password);

        const user = await AuthModel.create({
            firstName,
            lastName,
            age,
            username,
            password: hashedPassword
        }).save();

        return user;
    }

    static generateTokens(payload: object) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'secret', { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'secret');
        
        return { accessToken, refreshToken };
    }

    static async validateAccessToken(accessToken: string) {
        try {
            return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'secret');
        } catch (error) {
            throw new UnauthorizedError('Invalid access token', HttpStatusCodesUtil.NOT_FOUND);
        }
    }

    static async validateRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'secret');
        } catch (error) {
            throw new UnauthorizedError('Invalid refresh token', HttpStatusCodesUtil.NOT_FOUND);
        }
    }

    static async login(username: string, password: string) {
        const user = await AuthModel.findOne({ where: { username } });
        if (!user) {
            throw new InputValidationError('Invalid username or password', HttpStatusCodesUtil.NOT_FOUND);
        }

        if (!user.password) {
            return;
        }

        if (!CryptoUtil.isValidPassword(password, user.password)) {
            throw new InputValidationError('Invalid username or password', HttpStatusCodesUtil.NOT_FOUND);
        }

        const { accessToken, refreshToken } = AuthService.generateTokens({ id: user.id, firstName: user.firstName ,lastName: user.lastName, age: user.age});
        return { id: user.id, firstName: user.firstName,lastName: user.lastName, age: user.age, accessToken, refreshToken };
    }
}

export default AuthService;
