class ApiError extends Error {
  constructor(
    statusCode: string | number,
    message: string,
    isOperational: boolean = true,
    stack: string = '',
  ) {
    super(message);
    // @ts-ignore
    this.statusCode = statusCode;
    // @ts-ignore
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
