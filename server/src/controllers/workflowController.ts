import { Request, Response, NextFunction } from 'express';

export const getAptitudeQuestions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = [
      {
        id: 'apt1',
        prompt: 'If 7x + 5 = 45, what is x?',
        options: ['4', '5', '6', '7'],
      },
      {
        id: 'apt2',
        prompt: 'Which number comes next in this sequence: 2, 6, 12, 20, ?',
        options: ['26', '28', '30', '34'],
      },
      {
        id: 'apt3',
        prompt: 'A word opposite in meaning to “lucid” is:',
        options: ['Vague', 'Bright', 'Clear', 'Smart'],
      },
      {
        id: 'apt4',
        prompt: 'If a train travels 240 km in 3 hours, its speed is:',
        options: ['60 km/h', '70 km/h', '80 km/h', '90 km/h'],
      },
      {
        id: 'apt5',
        prompt: 'Which word does not belong: Banana, Apple, Rose, Mango?',
        options: ['Banana', 'Apple', 'Rose', 'Mango'],
      },
    ];
    res.json({ data: questions });
  } catch (error) {
    next(error);
  }
};

export const getTechnicalQuestions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = [
      {
        id: 'tech1',
        prompt: 'Which of these is a React hook for managing side effects?',
        options: ['useState', 'useMemo', 'useEffect', 'useContext'],
      },
      {
        id: 'tech2',
        prompt: 'In JavaScript, which keyword declares a block-scoped variable?',
        options: ['var', 'let', 'const', 'both let and const'],
      },
      {
        id: 'tech3',
        prompt: 'What is the default port for MongoDB?',
        options: ['3306', '27017', '8080', '5432'],
      },
      {
        id: 'tech4',
        prompt: 'Which CSS property controls spacing between letters?',
        options: ['line-height', 'letter-spacing', 'word-spacing', 'text-indent'],
      },
      {
        id: 'tech5',
        prompt: 'A class in OOP is best described as:',
        options: ['A method', 'A blueprint', 'A variable', 'A function call'],
      },
    ];
    res.json({ data: questions });
  } catch (error) {
    next(error);
  }
};

const codingProblems = [
  {
    title: 'Two Sum',
    description: 'Implement solve(input) where input is a comma-separated list of numbers and a target value. Return the first pair of numbers that add up to the target, separated by a comma, or return "none" if no pair exists.',
    tests: [
      { input: '2,7,11,15|9', expected: '2,7' },
      { input: '3,2,4|6', expected: '2,4' },
      { input: '3,3|6', expected: '3,3' },
    ],
  },
  {
    title: 'Valid Parentheses',
    description: 'Implement solve(input) where input is a string containing parentheses. Return "true" if the parentheses are valid and properly nested, otherwise return "false".',
    tests: [
      { input: '()[]{}', expected: 'true' },
      { input: '([)]', expected: 'false' },
      { input: '{[]}', expected: 'true' },
    ],
  },
  {
    title: 'Reverse Words in a String',
    description: 'Implement solve(input) where input is a sentence. Return a new string with the word order reversed, preserving spacing between words.',
    tests: [
      { input: 'hello world', expected: 'world hello' },
      { input: 'practice makes perfect', expected: 'perfect makes practice' },
      { input: 'ai interview assignment', expected: 'assignment interview ai' },
    ],
  },
  {
    title: 'Maximum Subarray Sum',
    description: 'Implement solve(input) where input is a comma-separated list of integers. Return the maximum sum of any contiguous subarray.',
    tests: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5,4,-1,7,8]', expected: '23' },
    ],
  },
  {
    title: 'First Unique Character',
    description: 'Implement solve(input) where input is a string. Return the first non-repeating character or "_" if none exist.',
    tests: [
      { input: 'leetcode', expected: 'l' },
      { input: 'loveleetcode', expected: 'v' },
      { input: 'aabb', expected: '_' },
    ],
  },
];

const interviewQuestionsBank = [
  'Explain how you would solve the Two Sum problem and what data structures you would use.',
  'Walk through the process of optimizing a slow SQL query in a production system.',
  'Describe a scenario where you had to debug a failure in a distributed system.',
  'How do you prepare for a system design interview when the problem is open-ended?',
  'Explain the difference between synchronous and asynchronous programming in JavaScript.',
  'Discuss how you would handle state management in a large React application.',
  'What steps do you take when a deadline shifts and your team must reprioritize features?',
  'How do you evaluate the trade-offs between maintainability and performance?',
  'What is your approach for reviewing another engineer’s code before merge?',
  'Explain a time you used automation to reduce manual effort in a workflow.',
  'How would you ensure your API remains backward compatible after a version update?',
  'Describe how you would improve developer experience on a fast-moving engineering team.',
  'How do you learn a new programming language or framework when joining a new project?',
  'What is the most important quality in a successful technical leader?',
];

export const getCodingProblem = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const problem = codingProblems[Math.floor(Math.random() * codingProblems.length)];
    res.json({ data: problem });
  } catch (error) {
    next(error);
  }
};

export const getInterviewQuestions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const shuffled = [...interviewQuestionsBank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(6, shuffled.length));
    res.json({ data: selected });
  } catch (error) {
    next(error);
  }
};
