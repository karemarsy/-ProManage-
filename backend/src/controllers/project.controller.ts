import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as ProjectService from '../services/project.service';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await ProjectService.getAllProjects(req.user!.userId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await ProjectService.getProjectById(
      req.params['id'] as string,
      req.user!.userId,
    );
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await ProjectService.createProject(req.body, req.user!.userId);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await ProjectService.updateProject(
      req.params['id'] as string,
      req.body,
    );
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await ProjectService.deleteProject(req.params['id'] as string);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await ProjectService.addMember(
      req.params['id'] as string,
      req.body.userId,
    );
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};