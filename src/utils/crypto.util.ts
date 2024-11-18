import bCrypt from 'bcryptjs';

export default class CryptoUtil {
  static createHash(password: string): string {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
  }
  static isValidPassword(password: string, hashPassword: string): boolean {
    return bCrypt.compareSync(password, hashPassword);
  }
}
