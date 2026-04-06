import '../helpers/prismaMock';
import { prismaMock } from '../helpers/prismaMock';
import {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
  updateProject,
  addMember,
} from '../../services/project.service';

const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  description: 'A project',
  archived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  members: [],
  _count: { tasks: 0 },
};

describe('ProjectService', () => {
    describe('updateProject', () => {
    it('should update a project', async () => {
      prismaMock.project.update.mockResolvedValue({
        ...mockProject,
        name: 'Updated Name',
      } as any);

      const result = await updateProject('proj-1', { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
    });
  });

  describe('addMember', () => {
    it('should add a member to a project', async () => {
      prismaMock.projectMember.create.mockResolvedValue({
        id: 'member-1',
        projectId: 'proj-1',
        userId: 'user-2',
        createdAt: new Date(),
      } as any);

      const result = await addMember('proj-1', 'user-2');

      expect(result.userId).toBe('user-2');
    });
  });
  describe('getAllProjects', () => {
    it('should return all projects for a user', async () => {
      prismaMock.project.findMany.mockResolvedValue([mockProject] as any);

      const result = await getAllProjects('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Project');
    });
  });

  describe('getProjectById', () => {
    it('should return a project by id', async () => {
      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        tasks: [],
      } as any);

      const result = await getProjectById('proj-1', 'user-1');

      expect(result.id).toBe('proj-1');
    });

    it('should throw if project not found', async () => {
      prismaMock.project.findFirst.mockResolvedValue(null);

      await expect(getProjectById('bad-id', 'user-1')).rejects.toThrow('Project not found');
    });
  });

  describe('createProject', () => {
    it('should create a project', async () => {
      prismaMock.project.create.mockResolvedValue({
        ...mockProject,
        members: [],
      } as any);

      const result = await createProject({ name: 'Test Project' }, 'user-1');

      expect(result.name).toBe('Test Project');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      prismaMock.project.delete.mockResolvedValue(mockProject as any);

      await expect(deleteProject('proj-1')).resolves.not.toThrow();
    });
  });
});