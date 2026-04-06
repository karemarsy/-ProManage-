import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        taskId: req.params['taskId'] as string,
        authorId: req.user!.userId,
      },
      include: { author: { select: { id: true, name: true } } },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.comment.delete({ where: { id: req.params['id'] as string } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};