import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as TaskService from '../services/task.service';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await TaskService.getTasksByProject(req.params['projectId'] as string);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await TaskService.getTaskById(req.params['id'] as string);
    res.json(task);
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await TaskService.createTask(req.params['projectId'] as string, req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await TaskService.updateTask(req.params['id'] as string, req.body);
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await TaskService.deleteTask(req.params['id'] as string);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};