import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { signToken } from '../../utils/jwt';
import { Request, Response, NextFunction } from 'express';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('authenticate middleware', () => {
  it('should call next() with valid token', () => {
    const token = signToken({ userId: 'user-1', role: 'MEMBER' });
    const req = { cookies: { token } } as any;
    const res = mockResponse();

    authenticate(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe('user-1');
  });

  it('should return 401 with no token', () => {
    const req = { cookies: {} } as any;
    const res = mockResponse();

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 401 with invalid token', () => {
    const req = { cookies: { token: 'invalid-token' } } as any;
    const res = mockResponse();

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('requireAdmin middleware', () => {
  it('should call next() for admin users', () => {
    const req = { user: { userId: 'user-1', role: 'ADMIN' } } as any;
    const res = mockResponse();

    requireAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 403 for non-admin users', () => {
    const req = { user: { userId: 'user-1', role: 'MEMBER' } } as any;
    const res = mockResponse();

    requireAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});