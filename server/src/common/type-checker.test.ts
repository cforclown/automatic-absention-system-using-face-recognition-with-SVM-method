import { isArray, isString } from '.';

describe('type-checker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when checking string variable', () => {
    expect(isString('string')).toEqual(true);
  });

  it('should return false when checking non-string variable', () => {
    expect(isString(2)).toEqual(false);
  });

  it('should return false when checking non-array variable', () => {
    expect(isString(() => 1)).toEqual(false);
  });

  it('should return false when checking non-array variable', () => {
    expect(isString(async () => Promise.resolve(1))).toEqual(false);
  });

  it('should return true when checking array variable', () => {
    expect(isArray(['string'])).toEqual(true);
  });

  it('should return false when checking non-array variable', () => {
    expect(isArray(2)).toEqual(false);
  });

  it('should return false when checking non-array variable', () => {
    expect(isArray(() => 1)).toEqual(false);
  });

  it('should return false when checking non-array variable', () => {
    expect(isArray(async () => Promise.resolve(1))).toEqual(false);
  });
});
