import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../../controllers/task.controller';
import * as TaskService from '../../services/task.service';

jest.mock('../../services/task.service');

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

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  status: 'TODO',
  priority: 'MEDIUM',
  projectId: 'proj-1',
  labels: [],
};

describe('TaskController', () => {
  describe('getTasks', () => {
    it('should return tasks', async () => {
      (TaskService.getTasksByProject as jest.Mock).mockResolvedValue([mockTask]);
      const res = mockRes();

      await getTasks(mockReq({ params: { projectId: 'proj-1' } }), res);

      expect(res.json).toHaveBeenCalledWith([mockTask]);
    });

    it('should return 500 on error', async () => {
      (TaskService.getTasksByProject as jest.Mock).mockRejectedValue(new Error('error'));
      const res = mockRes();

      await getTasks(mockReq({ params: { projectId: 'proj-1' } }), res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getTask', () => {
    it('should return a task', async () => {
      (TaskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      const res = mockRes();

      await getTask(mockReq({ params: { id: 'task-1' } }), res);

      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if not found', async () => {
      (TaskService.getTaskById as jest.Mock).mockRejectedValue(new Error('Not found'));
      const res = mockRes();

      await getTask(mockReq({ params: { id: 'bad' } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createTask', () => {
    it('should create and return 201', async () => {
      (TaskService.createTask as jest.Mock).mockResolvedValue(mockTask);
      const res = mockRes();

      await createTask(mockReq({ params: { projectId: 'proj-1' }, body: { title: 'Test' } }), res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateTask', () => {
    it('should update and return task', async () => {
      (TaskService.updateTask as jest.Mock).mockResolvedValue(mockTask);
      const res = mockRes();

      await updateTask(mockReq({ params: { id: 'task-1' }, body: { title: 'Updated' } }), res);

      expect(res.json).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete and return 204', async () => {
      (TaskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();

      await deleteTask(mockReq({ params: { id: 'task-1' } }), res);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});