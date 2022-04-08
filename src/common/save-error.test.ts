import { SaveError } from '.';

const mockLoggerSuccess = jest.fn();
// const mockLoggerError = jest.fn();
jest.mock('./logger', () => ({
  Logger: {
    success: (): void => mockLoggerSuccess(),
    error: jest.fn(),
    warn: jest.fn(),
    danger: jest.fn()
  }
}));

const mockExistsSync = jest.fn();
const mockAppendFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
jest.mock('fs', () => ({
  existsSync: (): boolean => mockExistsSync(),
  appendFileSync: (): void => mockAppendFileSync(),
  writeFileSync: (): void => mockWriteFileSync()
}));

const mockGetNodeEnv = jest.fn();
jest.mock('./environment', () => ({
  Environment: {
    getNodeEnv: (): string => mockGetNodeEnv()
  }
}));

describe('save-error', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  mockGetNodeEnv.mockReturnValue('development');
  mockExistsSync.mockReturnValue(true);

  it('should append error on file successfully', () => {
    SaveError(new Error('error'));
    expect(mockExistsSync).toHaveBeenCalled();
    expect(mockAppendFileSync).toHaveBeenCalled();
    expect(mockWriteFileSync).not.toHaveBeenCalled();
    expect(mockLoggerSuccess).toHaveBeenCalled();
  });

  it('should write error to a new file successfully', () => {
    mockExistsSync.mockReturnValueOnce(false);

    SaveError(new Error('error'));
    expect(mockExistsSync).toHaveBeenCalled();
    expect(mockAppendFileSync).not.toHaveBeenCalled();
    expect(mockWriteFileSync).toHaveBeenCalled();
    expect(mockLoggerSuccess).toHaveBeenCalled();
  });

  it('should do nothing when node environment is test', () => {
    mockGetNodeEnv.mockReturnValue('test');

    SaveError(new Error('error'));
    expect(mockExistsSync).not.toHaveBeenCalled();
    expect(mockAppendFileSync).not.toHaveBeenCalled();
    expect(mockWriteFileSync).not.toHaveBeenCalled();
    expect(mockLoggerSuccess).not.toHaveBeenCalled();
  });
});
