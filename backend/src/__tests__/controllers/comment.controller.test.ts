import '../helpers/prismaMock';
import { prismaMock } from '../helpers/prismaMock';
import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { addComment, deleteComment } from '../../controllers/comment.controller';

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides = {}): AuthRequest =>
  ({
    user: { userId: 'user-1', role: 'MEMBER' },
    params: {},
    body: {},
    ...overrides,
  }) as AuthRequest;

describe('CommentController', () => {
  describe('addComment', () => {
    it('should create a comment and return 201', async () => {
      prismaMock.comment.create.mockResolvedValue({
        id: 'comment-1',
        content: 'Great task!',
        taskId: 'task-1',
        authorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 'user-1', name: 'Test User' },
      } as any);

      const req = mockReq({
        params: { taskId: 'task-1' },
        body: { content: 'Great task!' },
      });
      const res = mockRes();

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 on error', async () => {
      prismaMock.comment.create.mockRejectedValue(new Error('DB error'));

      const req = mockReq({
        params: { taskId: 'task-1' },
        body: { content: 'Test' },
      });
      const res = mockRes();

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment and return 204', async () => {
      prismaMock.comment.delete.mockResolvedValue({} as any);

      const req = mockReq({ params: { id: 'comment-1' } });
      const res = mockRes();

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 400 on error', async () => {
      prismaMock.comment.delete.mockRejectedValue(new Error('Not found'));

      const req = mockReq({ params: { id: 'bad-id' } });
      const res = mockRes();

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
