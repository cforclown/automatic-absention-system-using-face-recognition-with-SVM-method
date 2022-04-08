class BaseException extends Error {
  constructor(exception, message) {
    super(message);
    this.name = `[${exception.code}] ${exception.name}`;
  }
}

export default BaseException;
