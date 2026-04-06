import { Request, Response } from 'express';
import { register, login, logout } from '../../controllers/auth.controller';
import * as AuthService from '../../services/auth.service';

jest.mock('../../services/auth.service');

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  describe('register', () => {
    it('should register and return 201', async () => {
      (AuthService.registerUser as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'MEMBER' },
        token: 'fake-token',
      });

      const req = {
        body: { email: 'test@test.com', name: 'Test User', password: 'password123' },
      } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalledWith('token', 'fake-token', expect.any(Object));
    });

    it('should return 400 with invalid body', async () => {
      const req = { body: { email: 'bad-email' } } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if service throws', async () => {
      (AuthService.registerUser as jest.Mock).mockRejectedValue(new Error('Email already in use'));

      const req = {
        body: { email: 'test@test.com', name: 'Test User', password: 'password123' },
      } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should login and return 200', async () => {
      (AuthService.loginUser as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'MEMBER' },
        token: 'fake-token',
      });

      const req = {
        body: { email: 'test@test.com', password: 'password123' },
      } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 with invalid body', async () => {
      const req = { body: {} } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 if service throws', async () => {
      (AuthService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const req = {
        body: { email: 'test@test.com', password: 'wrongpassword' },
      } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('logout', () => {
    it('should clear cookie and return 200', () => {
      const req = {} as Request;
      const res = mockRes();

      logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});