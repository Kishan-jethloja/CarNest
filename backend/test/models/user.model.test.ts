import { UserModel } from '../../src/models/user.model';

describe('User Model', () => {
  describe('Creation and Validation', () => {
    const validUserData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully build a user when provided with required fields', () => {
      const user = UserModel.build(validUserData);

      expect(user.username).toBe(validUserData.username);
      expect(user.email).toBe(validUserData.email);
    });

    it('should assign "customer" as the default role', () => {
      const user = UserModel.build(validUserData);

      expect(user.role).toBe('customer');
    });

    it('should throw a validation error if username is missing', () => {
      const { username, ...missingUsername } = validUserData;

      expect(() => UserModel.build(missingUsername)).toThrow();
    });

    it('should throw a validation error if email is missing', () => {
      const { email, ...missingEmail } = validUserData;

      expect(() => UserModel.build(missingEmail)).toThrow();
    });

    it('should throw a validation error if password is missing', () => {
      const { password, ...missingPassword } = validUserData;

      expect(() => UserModel.build(missingPassword)).toThrow();
    });
  });

  describe('Password Management', () => {
    const plainPassword = 'mySuperSecretPassword123';

    it('should hash a plain text password', async () => {
      const hashedPassword = await UserModel.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      // Valid bcrypt hashes usually start with $2a$, $2b$, or $2y$
      expect(hashedPassword).toMatch(/^\$2[aby]\$/);
    });

    it('should correctly compare a plain text password against its hash', async () => {
      const hashedPassword = await UserModel.hashPassword(plainPassword);
      const isMatch = await UserModel.comparePassword(plainPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should fail comparison when provided with an incorrect password', async () => {
      const hashedPassword = await UserModel.hashPassword(plainPassword);
      const isMatch = await UserModel.comparePassword('wrongPassword!', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
