import * as dotenv from 'dotenv';
dotenv.config();

process.env.JWT_SECRET = 'test-secret-key-for-jest-testing-only';
process.env.JWT_EXPIRES_IN = '7d';