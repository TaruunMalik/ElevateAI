import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

// Import actions AFTER all mocks are set up
let generateQuiz, saveQuizResult;

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/prisma');
jest.mock('@google/generative-ai');

describe('Interview Actions', () => {
  beforeAll(() => {
    // Dynamically require after mocks are in place
    const interviewActions = require('@/actions/interview');
    generateQuiz = interviewActions.generateQuiz;
    saveQuizResult = interviewActions.saveQuizResult;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset GoogleGenerativeAI mock for each test
    GoogleGenerativeAI.mockClear();
  });

  describe('generateQuiz', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      await expect(generateQuiz()).rejects.toThrow('Unauthorized');
    });

    it('should throw an error if user is not found in database', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      await expect(generateQuiz()).rejects.toThrow('User not found');
    });
  });

  describe('saveQuizResult', () => {
    it('should throw an error if user is not authenticated', async () => {
      auth.mockResolvedValueOnce({ userId: null });

      const questions = [{ question: 'Test', correctAnswer: 'A' }];
      const answers = ['A'];
      const score = 100;

      await expect(saveQuizResult(questions, answers, score)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce(null);

      const questions = [{ question: 'Test', correctAnswer: 'A' }];
      const answers = ['A'];
      const score = 100;

      await expect(saveQuizResult(questions, answers, score)).rejects.toThrow(
        'User not found'
      );
    });

    it('should save quiz result successfully', async () => {
      auth.mockResolvedValueOnce({ userId: 'test-user-123' });
      db.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      db.assessment.create.mockResolvedValueOnce({
        id: 'assessment-123',
        userId: 'user-123',
        quizScore: 80,
      });

      const questions = [
        {
          question: 'What is closure?',
          correctAnswer: 'A',
          explanation: 'Explanation here',
        },
      ];
      const answers = ['A'];
      const score = 100;

      const result = await saveQuizResult(questions, answers, score);

      expect(db.assessment.create).toHaveBeenCalled();
    });
  });
});
