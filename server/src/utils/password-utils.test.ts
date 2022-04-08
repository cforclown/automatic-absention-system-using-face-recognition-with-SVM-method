import { decrypt, encrypt, generateId, hashPassword } from '.';

describe('password-utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generate-id', () => {
    it('should successfully generate random id', () => {
      const id = generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toEqual('string');
      expect(id).toEqual(expect.stringMatching(/^[a-z0-9]+$/i));
    });
  });

  describe('hash-password', () => {
    it('should successfully return hashed password', async () => {
      const hashed = await hashPassword('password');
      expect(hashed).toBeTruthy();
      expect(typeof hashed).toEqual('string');
      expect(hashed).toEqual(expect.stringMatching(/^\w{128}$/));
    });
  });

  describe('encrypt-decryp', () => {
    it('should successfully encrypt and decrypt data', () => {
      const data = { message: 'this message should be encrypted' };
      const encryptedData = encrypt(JSON.stringify(data));
      const decryptedData = JSON.parse(decrypt(encryptedData));
      expect(encryptedData).toBeTruthy();
      expect(decryptedData).toBeTruthy();
      expect(decryptedData).toEqual(data);
    });
  });
});
