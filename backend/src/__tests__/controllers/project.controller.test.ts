import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
} from '../../controllers/project.controller';
import * as ProjectService from '../../services/project.service';

jest.mock('../../services/project.service');

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

const mockProject = {
  id: 'proj-1',
  name: 'Test',
  archived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  members: [],
};

describe('ProjectController', () => {
  describe('getProjects', () => {
    it('should return projects', async () => {
      (ProjectService.getAllProjects as jest.Mock).mockResolvedValue([mockProject]);
      const res = mockRes();

      await getProjects(mockReq(), res);

      expect(res.json).toHaveBeenCalledWith([mockProject]);
    });

    it('should return 500 on error', async () => {
      (ProjectService.getAllProjects as jest.Mock).mockRejectedValue(new Error('DB error'));
      const res = mockRes();

      await getProjects(mockReq(), res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProject', () => {
    it('should return a single project', async () => {
      (ProjectService.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      const res = mockRes();

      await getProject(mockReq({ params: { id: 'proj-1' } }), res);

      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it('should return 404 if not found', async () => {
      (ProjectService.getProjectById as jest.Mock).mockRejectedValue(new Error('Not found'));
      const res = mockRes();

      await getProject(mockReq({ params: { id: 'bad' } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createProject', () => {
    it('should create and return project', async () => {
      (ProjectService.createProject as jest.Mock).mockResolvedValue(mockProject);
      const res = mockRes();

      await createProject(mockReq({ body: { name: 'Test' } }), res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('deleteProject', () => {
    it('should delete and return 204', async () => {
      (ProjectService.deleteProject as jest.Mock).mockResolvedValue(undefined);
      const res = mockRes();

      await deleteProject(mockReq({ params: { id: 'proj-1' } }), res);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});