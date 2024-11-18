type ErrorConstructor = new (msg: string, status: number) => Error;

const ERRORS_NAME: string[] = [
  'ExpiredEmailConfirmError',
  'ExpiredTokenConfirmError',
  'ConflictError',
  'Forbidden',
  'PermissionError',
  'InputValidationError',
  'InvalidEmailConfirmError',
  'InvalidPasswordError',
  'MicroserviceError',
  'UnauthorizedError',
  'ResourceNotFoundError'
];

interface ErrorsUtil {
  [key: string]: ErrorConstructor;
}

const ErrorsUtil: ErrorsUtil = ERRORS_NAME.reduce((acc, className) => {
  acc[className] = class extends Error {
    constructor(msg: string, status: number) {
      super(msg);
      this.status = status;
      this.name = className;
    }
    status: number;
  };

  return acc;
}, {} as ErrorsUtil);

export default ErrorsUtil;
