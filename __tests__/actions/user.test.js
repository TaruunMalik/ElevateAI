import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Import actions AFTER all mocks are set up
let updateUser, onboardingstatus;

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/prisma');
jest.mock('next/cache');
jest.mock('@/actions/dashboard', () => ({
  generateAIInsights: jest.fn().mockResolvedValue({
    growthRate: 15,
    demandLevel: 'HIGH',
    topSkills: ['JavaScript', 'React'],
    marketOutlook: 'POSITIVE',
    keyTrends: [],
    recommendedSkills: [],
  }),
}));

describe('User Actions', () => {
  beforeAll(() => {
    // Dynamically require after mocks are in place
    const userActions = require('@/actions/user');
    updateUser = userActions.updateUser;
    onboardingstatus = userActions.onboardingstatus;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUser', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      const userData = {
        industry: 'tech-software-development',
        experience: 5,
        bio: 'Software Engineer',
        skills: ['JavaScript', 'React'],
      };

      await expect(updateUser(userData)).rejects.toThrow('Unauthorized');
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      const userData = {
        industry: 'tech-software-development',
        experience: 5,
        bio: 'Software Engineer',
        skills: ['JavaScript', 'React'],
      };

      await expect(updateUser(userData)).rejects.toThrow('User not found');
    });

    it('should update user with existing industry', async () => {
      const mockUser = { id: 'user-123' };
      const mockIndustryInsight = { industry: 'tech-software-development' };

      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(mockUser);

      // Mock the transaction
      db.$transaction = jest.fn((callback) => {
        return callback({
          industryInsight: {
            findUnique: jest.fn().mockResolvedValue(mockIndustryInsight),
          },
          user: {
            update: jest.fn().mockResolvedValue({
              ...mockUser,
              industry: 'tech-software-development',
              experience: 5,
            }),
          },
        });
      });

      const userData = {
        industry: 'tech-software-development',
        experience: 5,
        bio: 'Software Engineer',
        skills: ['JavaScript', 'React'],
      };

      await updateUser(userData);

      expect(db.$transaction).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should create new industry insight if it does not exist', async () => {
      const mockUser = { id: 'user-123' };

      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(mockUser);

      // Mock the transaction
      db.$transaction = jest.fn((callback) => {
        return callback({
          industryInsight: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
          user: {
            update: jest.fn().mockResolvedValue({
              ...mockUser,
              industry: 'tech-software-development',
            }),
          },
        });
      });

      const userData = {
        industry: 'tech-software-development',
        experience: 5,
        bio: 'Software Engineer',
        skills: ['JavaScript', 'React'],
      };

      await updateUser(userData);

      expect(db.$transaction).toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      db.$transaction = jest.fn(() =>
        Promise.reject(new Error('Transaction failed'))
      );

      const userData = {
        industry: 'tech-software-development',
        experience: 5,
        bio: 'Software Engineer',
        skills: ['JavaScript', 'React'],
      };

      await expect(updateUser(userData)).rejects.toThrow(
        'Failed to update profile'
      );
    });
  });

  describe('onboardingstatus', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      await expect(onboardingstatus()).rejects.toThrow('Unauthorized');
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      await expect(onboardingstatus()).rejects.toThrow('User not found');
    });

    it('should return isOnboarded true when user has industry', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique
        .mockResolvedValueOnce({ id: 'user-123' }) // First call in auth check
        .mockResolvedValueOnce({ industry: 'tech-software-development' }); // Second call for onboarding status

      const result = await onboardingstatus();

      expect(result).toEqual({ isOnboarded: true });
    });

    it('should return isOnboarded false when user does not have industry', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique
        .mockResolvedValueOnce({ id: 'user-123' }) // First call in auth check
        .mockResolvedValueOnce({ industry: null }); // Second call for onboarding status

      const result = await onboardingstatus();

      expect(result).toEqual({ isOnboarded: false });
    });

    it('should handle database errors gracefully', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      db.user.findUnique.mockRejectedValueOnce(new Error('Database Error'));

      await expect(onboardingstatus()).rejects.toThrow(
        'Failed to check onboarding status'
      );
    });
  });
});
