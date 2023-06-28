import * as bcrypt from 'bcrypt';

export const verifyPassword = (encrypted: string, expect: string): boolean => {
  return bcrypt.compareSync(expect, encrypted);
};
