// Difficulty level descriptions for prompt context
export const DIFFICULTY_MAP = {
  easy: "entry-level, fundamental knowledge",
  medium: "intermediate-level, practical knowledge",
  hard: "advanced-level, specialized knowledge",
  extreme: "expert-level, mastery and edge case knowledge",
};

// Generate quiz prompt with user context
export const generateQuizPrompt = ({
  count,
  difficulty,
  difficultyDescription,
  industry,
  skills,
}) => `
    Generate ${count} ${difficulty} technical interview questions for a ${industry} professional${
      skills?.length ? ` with expertise in ${skills.join(", ")}` : ""
    }. 
    
    The questions should be ${difficultyDescription} questions.
    
    For easy questions: focus on fundamental concepts and basic knowledge.
    For medium questions: include practical applications and moderate complexity.
    For hard questions: cover advanced topics, edge cases, and complex scenarios.
    For extreme questions: focus on expert-level mastery, obscure scenarios, and advanced edge cases.
    
    Each question should be multiple choice with 5 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string",
        }
      ]
    }
  `;

// Generate improvement tip prompt
export const generateImprovementPrompt = (industry, wrongQuestionsText) => `
      The user got the following ${industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
