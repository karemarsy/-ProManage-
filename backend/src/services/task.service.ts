import prisma from '../utils/prisma';
import { TaskStatus, Priority } from '@prisma/client';

interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  assigneeId?: string;
  labels?: string[];
}

export const getTasksByProject = async (projectId: string) => {
  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: { select: { id: true, name: true } },
      labels: true,
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true } },
      labels: true,
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!task) throw new Error('Task not found');
  return task;
};

export const createTask = async (projectId: string, data: TaskInput) => {
  const { labels, dueDate, ...rest } = data;
  return prisma.task.create({
    data: {
      ...rest,
      projectId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      labels: labels?.length
        ? {
            connectOrCreate: labels.map((name) => ({
              where: { name },
              create: { name },
            })),
          }
        : undefined,
    },
    include: { labels: true, assignee: { select: { id: true, name: true } } },
  });
};

export const updateTask = async (id: string, data: Partial<TaskInput>) => {
  const { labels, dueDate, ...rest } = data;
  return prisma.task.update({
    where: { id },
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      labels: labels
        ? {
            set: [],
            connectOrCreate: labels.map((name) => ({
              where: { name },
              create: { name },
            })),
          }
        : undefined,
    },
    include: { labels: true, assignee: { select: { id: true, name: true } } },
  });
};

export const deleteTask = async (id: string) => {
  return prisma.task.delete({ where: { id } });
};
