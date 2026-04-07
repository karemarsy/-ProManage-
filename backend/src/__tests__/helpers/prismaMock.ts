import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export type MockPrisma = DeepMockProxy<PrismaClient>;

export const prismaMock = mockDeep<PrismaClient>() as MockPrisma;

jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
