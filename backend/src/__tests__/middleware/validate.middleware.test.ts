import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

describe('validate middleware', () => {
  it('should call next() with valid data', () => {
    const req = {
      body: { name: 'Test', email: 'test@test.com' },
    } as Request;
    const res = mockRes();

    validate(testSchema)(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.body).toEqual({ name: 'Test', email: 'test@test.com' });
  });

  it('should return 400 with invalid data', () => {
    const req = {
      body: { name: '', email: 'not-an-email' },
    } as Request;
    const res = mockRes();

    validate(testSchema)(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Validation error' }),
    );
  });

  it('should return 400 with missing fields', () => {
    const req = { body: {} } as Request;
    const res = mockRes();

    validate(testSchema)(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});