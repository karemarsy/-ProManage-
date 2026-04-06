import '../helpers/prismaMock';
import { prismaMock } from '../helpers/prismaMock';
import { registerUser, loginUser } from '../../services/auth.service';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  describe('registerUser', () => {
    it('should register a new user and return a token', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'MEMBER',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await registerUser({
        email: 'test@test.com',
        name: 'Test User',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@test.com');
      expect(result.token).toBeDefined();
    });

    it('should throw if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'MEMBER',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        registerUser({ email: 'test@test.com', name: 'Test', password: 'password123' }),
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('loginUser', () => {
    it('should login with correct credentials', async () => {
      const hashed = await bcrypt.hash('password123', 12);
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'MEMBER',
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await loginUser({ email: 'test@test.com', password: 'password123' });

      expect(result.user.email).toBe('test@test.com');
      expect(result.token).toBeDefined();
    });

    it('should throw with wrong password', async () => {
      const hashed = await bcrypt.hash('correctpassword', 12);
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'MEMBER',
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        loginUser({ email: 'test@test.com', password: 'wrongpassword' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        loginUser({ email: 'nobody@test.com', password: 'password123' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});