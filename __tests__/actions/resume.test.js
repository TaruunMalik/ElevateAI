import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Import actions AFTER all mocks are set up
let saveResume, getResume, improveWithAI;

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/prisma');
jest.mock('@google/generative-ai');
jest.mock('next/cache');

describe('Resume Actions', () => {
  beforeAll(() => {
    // Dynamically require after mocks are in place
    const resumeActions = require('@/actions/resume');
    saveResume = resumeActions.saveResume;
    getResume = resumeActions.getResume;
    improveWithAI = resumeActions.improveWithAI;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    GoogleGenerativeAI.mockClear();
  });

  describe('saveResume', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      await expect(saveResume('test resume content')).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      await expect(saveResume('test resume content')).rejects.toThrow(
        'User not found'
      );
    });

    it('should create a new resume when it does not exist', async () => {
      const mockUser = { id: 'user-123' };
      const mockResume = {
        id: 'resume-123',
        userId: 'user-123',
        content: 'test resume content',
      };

      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(mockUser);
      db.resume.upsert.mockResolvedValueOnce(mockResume);

      const result = await saveResume('test resume content');

      expect(result).toEqual(mockResume);
      expect(db.resume.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        update: { content: 'test resume content' },
        create: {
          userId: 'user-123',
          content: 'test resume content',
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/resume');
    });

    it('should update an existing resume', async () => {
      const mockUser = { id: 'user-123' };
      const mockResume = {
        id: 'resume-123',
        userId: 'user-123',
        content: 'updated resume content',
      };

      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(mockUser);
      db.resume.upsert.mockResolvedValueOnce(mockResume);

      const result = await saveResume('updated resume content');

      expect(result).toEqual(mockResume);
      expect(db.resume.upsert).toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      db.resume.upsert.mockRejectedValueOnce(new Error('Database Error'));

      await expect(saveResume('test resume content')).rejects.toThrow(
        'Failed to save resume'
      );
    });
  });

  describe('getResume', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      await expect(getResume()).rejects.toThrow('Unauthorized');
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      await expect(getResume()).rejects.toThrow('User not found');
    });

    it('should return user resume', async () => {
      const mockUser = { id: 'user-123' };
      const mockResume = {
        id: 'resume-123',
        userId: 'user-123',
        content: 'test resume content',
      };

      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(mockUser);
      db.resume.findUnique.mockResolvedValueOnce(mockResume);

      const result = await getResume();

      expect(result).toEqual(mockResume);
      expect(db.resume.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });

    it('should return null if resume does not exist', async () => {
      const mockUser = { id: 'user-123' };

      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(mockUser);
      db.resume.findUnique.mockResolvedValueOnce(null);

      const result = await getResume();

      expect(result).toBeNull();
    });
  });

  describe('improveWithAI', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      await expect(improveWithAI({ current: 'test', type: 'summary' })).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      await expect(improveWithAI({ current: 'test', type: 'summary' })).rejects.toThrow(
        'User not found'
      );
    });
  });
});
