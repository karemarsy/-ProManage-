import '../helpers/prismaMock';
import { prismaMock } from '../helpers/prismaMock';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../../services/task.service';

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'A task',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  projectId: 'proj-1',
  assigneeId: null,
  dueDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  labels: [],
  assignee: null,
  _count: { comments: 0 },
};

describe('TaskService', () => {
    describe('updateTask', () => {
    it('should update a task', async () => {
      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
      } as any);

      const result = await updateTask('task-1', { title: 'Updated Task' });

      expect(result.title).toBe('Updated Task');
    });

    it('should update task with labels', async () => {
      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        labels: [{ id: 'label-1', name: 'bug', color: '#ff0000' }],
      } as any);

      const result = await updateTask('task-1', {
        title: 'Updated',
        labels: ['bug'],
      });

      expect(result.labels).toHaveLength(1);
    });
  });

  describe('createTask with dueDate', () => {
    it('should create a task with a due date', async () => {
      prismaMock.task.create.mockResolvedValue({
        ...mockTask,
        dueDate: new Date('2024-12-31'),
      } as any);

      const result = await createTask('proj-1', {
        title: 'Task with date',
        dueDate: '2024-12-31',
      });

      expect(result).toBeDefined();
    });

    it('should create a task with labels', async () => {
      prismaMock.task.create.mockResolvedValue({
        ...mockTask,
        labels: [{ id: 'l1', name: 'feature', color: '#00ff00' }],
      } as any);

      const result = await createTask('proj-1', {
        title: 'Task with labels',
        labels: ['feature'],
      });

      expect(result.labels).toHaveLength(1);
    });
  });
  describe('getTasksByProject', () => {
    it('should return tasks for a project', async () => {
      prismaMock.task.findMany.mockResolvedValue([mockTask] as any);

      const result = await getTasksByProject('proj-1');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Task');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      prismaMock.task.findUnique.mockResolvedValue({
        ...mockTask,
        comments: [],
      } as any);

      const result = await getTaskById('task-1');

      expect(result.id).toBe('task-1');
    });

    it('should throw if task not found', async () => {
      prismaMock.task.findUnique.mockResolvedValue(null);

      await expect(getTaskById('bad-id')).rejects.toThrow('Task not found');
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      prismaMock.task.create.mockResolvedValue(mockTask as any);

      const result = await createTask('proj-1', { title: 'Test Task' });

      expect(result.title).toBe('Test Task');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      prismaMock.task.delete.mockResolvedValue(mockTask as any);

      await expect(deleteTask('task-1')).resolves.not.toThrow();
    });
  });
});