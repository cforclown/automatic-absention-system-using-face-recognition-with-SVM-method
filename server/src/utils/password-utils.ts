import { AES, enc, SHA512 } from 'crypto-js';
import { customAlphabet } from 'nanoid';
import { Environment } from '../common';

export const generateId = function (): string {
  return customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16)();
};
export const hashPassword = async function (password: string): Promise<string> {
  return SHA512(password).toString(enc.Hex);
};
export function encrypt (data: string): string {
  return AES.encrypt(data, Environment.getEncryptionKey()).toString();
}
export function decrypt (encrypted: string): string {
  return AES.decrypt(encrypted, Environment.getEncryptionKey()).toString(enc.Utf8);
}
