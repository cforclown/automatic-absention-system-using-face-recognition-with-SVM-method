import { Environment } from '.';

describe('environment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully return environment variable value', () => {
    expect(Environment.getNodeEnv()).toBeTruthy();
  });

  it('should throw an error when environment variable not found', () => {
    process.env.NODE_ENV = undefined;
    expect(Environment.getNodeEnv).toThrowError();
  });
});
