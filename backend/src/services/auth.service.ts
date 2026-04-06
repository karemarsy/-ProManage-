import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { signToken } from '../utils/jwt';

interface RegisterInput {
  email: string;
  name: string;
  password: string;
  role?: 'ADMIN' | 'MEMBER';
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: hashed,
      role: input.role ?? 'MEMBER',
    },
    select: { id: true, email: true, name: true, role: true },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = signToken({ userId: user.id, role: user.role });
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
};