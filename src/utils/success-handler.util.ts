import { Response, NextFunction } from 'express';
import ErrorsUtil from './errors.util';
import HttpStatusCodesUtil from './http-status-codes.util';

const { ResourceNotFoundError } = ErrorsUtil;

export default class SuccessHandlerUtil {
  static handleTokenVerification(response: Response, next: NextFunction, result: any): void {
    SuccessHandlerUtil._sendResponse(response, HttpStatusCodesUtil.OK, result);
  }
  
  private static _sendResponse(response: Response, status: number, data?: any): void {
    response.status(status).json(data);
  }

  static handleList(res: Response, next: NextFunction, result: any): void {
    SuccessHandlerUtil._sendResponse(res, HttpStatusCodesUtil.OK, result);
  }

  static handleAdd(response: Response, next: NextFunction, result: any): void {
    if (!result) {
      return SuccessHandlerUtil._sendResponse(response, HttpStatusCodesUtil.NO_CONTENT, {});
    }
    return SuccessHandlerUtil._sendResponse(response, HttpStatusCodesUtil.CREATED, result);
  }

  static handleGet(response: Response, next: NextFunction, result: any): void {
    if (!result) {
      return next(new ResourceNotFoundError('The specified resource is not found.', HttpStatusCodesUtil.NOT_FOUND));
    }
    return SuccessHandlerUtil._sendResponse(response, HttpStatusCodesUtil.OK, result);
  }

  static handleUpdate(response: Response, next: NextFunction, result: any): void {
    if (!result) {
      return SuccessHandlerUtil._sendResponse(response, HttpStatusCodesUtil.NO_CONTENT, {});
    }
    return SuccessHandlerUtil._sendResponse(response, HttpStatusCodesUtil.OK, result);
  }
}
