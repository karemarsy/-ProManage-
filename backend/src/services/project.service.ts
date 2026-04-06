import prisma from '../utils/prisma';

export const getAllProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      archived: false,
      members: { some: { userId } },
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getProjectById = async (id: string, userId: string) => {
  const project = await prisma.project.findFirst({
    where: { id, members: { some: { userId } } },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true } },
          labels: true,
          _count: { select: { comments: true } },
        },
      },
    },
  });
  if (!project) throw new Error('Project not found');
  return project;
};

export const createProject = async (
  data: { name: string; description?: string },
  userId: string,
) => {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      members: { create: { userId } },
    },
    include: { members: true },
  });
};

export const updateProject = async (
  id: string,
  data: { name?: string; description?: string; archived?: boolean },
) => {
  return prisma.project.update({ where: { id }, data });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({ where: { id } });
};

export const addMember = async (projectId: string, userId: string) => {
  return prisma.projectMember.create({ data: { projectId, userId } });
};