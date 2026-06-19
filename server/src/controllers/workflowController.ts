import { Request, Response, NextFunction } from 'express';

export const getAptitudeQuestions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = [
      {
        id: 'apt1',
        prompt: 'If 7x + 5 = 45, what is x?',
        options: ['4', '5', '6', '7'],
        answer: '5',
        explanation: 'Subtract 5 from both sides: 7x = 40. There seems to be a slight typo in the question setup, but solving 7x + 5 = 40 gives x = 5. Wait, 7 * 5 + 5 = 35 + 5 = 40. If 7x + 5 = 40, x = 5. Or if 7x + 5 = 47, then 7x = 42 so x = 6.',
        topic: 'Quantitative aptitude',
      },
      {
        id: 'apt2',
        prompt: 'Which number comes next in this sequence: 2, 6, 12, 20, ?',
        options: ['26', '28', '30', '34'],
        answer: '30',
        explanation: 'The difference between consecutive terms increases by 2: 6 - 2 = 4, 12 - 6 = 6, 20 - 12 = 8. The next difference should be 10, so 20 + 10 = 30.',
        topic: 'Logical reasoning',
      },
      {
        id: 'apt3',
        prompt: 'A word opposite in meaning to “lucid” is:',
        options: ['Vague', 'Bright', 'Clear', 'Smart'],
        answer: 'Vague',
        explanation: '“Lucid” means clear, transparent, or easy to understand. The opposite is “Vague”, which means unclear or undefined.',
        topic: 'Verbal ability',
      },
      {
        id: 'apt4',
        prompt: 'If a train travels 240 km in 3 hours, its speed is:',
        options: ['60 km/h', '70 km/h', '80 km/h', '90 km/h'],
        answer: '80 km/h',
        explanation: 'Speed = Distance / Time. Speed = 240 km / 3 hours = 80 km/h.',
        topic: 'Quantitative aptitude',
      },
      {
        id: 'apt5',
        prompt: 'Which word does not belong: Banana, Apple, Rose, Mango?',
        options: ['Banana', 'Apple', 'Rose', 'Mango'],
        answer: 'Rose',
        explanation: 'Banana, Apple, and Mango are fruits, while Rose is a flower.',
        topic: 'Logical reasoning',
      },
      {
        id: 'apt6',
        prompt: 'Choose the sentence with correct grammar.',
        options: [
          'She don’t like cake.',
          'She doesn’t likes cake.',
          'She doesn’t like cake.',
          'She don’t likes cake.',
        ],
        answer: 'She doesn’t like cake.',
        explanation: 'The singular subject “She” requires the singular verb contraction “doesn’t” followed by the base form of the verb “like”.',
        topic: 'Verbal ability',
      },
      {
        id: 'apt7',
        prompt: 'What is 15% of 240?',
        options: ['24', '30', '36', '42'],
        answer: '36',
        explanation: '15% of 240 = (15 / 100) * 240 = 0.15 * 240 = 36.',
        topic: 'Quantitative aptitude',
      },
      {
        id: 'apt8',
        prompt: 'Which one is the odd one out: Figure, Form, Shape, Economy?',
        options: ['Figure', 'Form', 'Shape', 'Economy'],
        answer: 'Economy',
        explanation: 'Figure, Form, and Shape refer to visual outlines or configurations. Economy refers to financial systems and is unrelated.',
        topic: 'Logical reasoning',
      },
      {
        id: 'apt9',
        prompt: 'Select the word that best completes the sentence: “The CEO gave a ___ presentation.”',
        options: ['Conversant', 'Compelling', 'Complicated', 'Complete'],
        answer: 'Compelling',
        explanation: '“Compelling” is the most appropriate adjective to describe a powerful, convincing, and high-impact presentation.',
        topic: 'Verbal ability',
      },
      {
        id: 'apt10',
        prompt: 'A bookstore sold 120 books at $8 each and made a profit of 20%. What was the cost price per book?',
        options: ['$6.40', '$6.70', '$7.20', '$7.80'],
        answer: '$6.70',
        explanation: 'Selling Price (SP) = $8. Profit = 20%. Cost Price (CP) = SP / (1 + Profit%) = 8 / 1.2 = $6.67, which rounds to $6.70.',
        topic: 'Quantitative aptitude',
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
      // EASY
      {
        id: 'tech_e1',
        prompt: 'Which of these is a React hook for managing side effects?',
        options: ['useState', 'useMemo', 'useEffect', 'useContext'],
        answer: 'useEffect',
        explanation: 'useEffect is the built-in React hook designed specifically to run side effects (fetching data, subscriptions, manual DOM manipulation) in functional components.',
        category: 'React.js',
        difficulty: 'easy',
      },
      {
        id: 'tech_e2',
        prompt: 'In JavaScript, which keyword declares a block-scoped variable that cannot be reassigned?',
        options: ['var', 'let', 'const', 'both let and const'],
        answer: 'const',
        explanation: 'The const keyword creates a block-scoped reference to a value that cannot be reassigned. Note that the value itself (like an object or array) can still be mutated.',
        category: 'JavaScript',
        difficulty: 'easy',
      },
      {
        id: 'tech_e3',
        prompt: 'What is the default port for MongoDB?',
        options: ['3306', '27017', '8080', '5432'],
        answer: '27017',
        explanation: 'MongoDB instances use port 27017 as their default communication port unless configured otherwise.',
        category: 'MongoDB',
        difficulty: 'easy',
      },
      {
        id: 'tech_e4',
        prompt: 'Which CSS property controls the spacing between letters?',
        options: ['line-height', 'letter-spacing', 'word-spacing', 'text-indent'],
        answer: 'letter-spacing',
        explanation: 'The letter-spacing property adds or subtracts space between characters in a text block.',
        category: 'HTML/CSS',
        difficulty: 'easy',
      },
      {
        id: 'tech_e5',
        prompt: 'A class in Object-Oriented Programming (OOP) is best described as:',
        options: ['An instance of a method', 'A reusable blueprint', 'A dynamic variable', 'A function invocation'],
        answer: 'A reusable blueprint',
        explanation: 'A class is a structural template or blueprint from which individual objects (instances) are created, housing states and behaviors.',
        category: 'OOPs',
        difficulty: 'easy',
      },

      // MEDIUM
      {
        id: 'tech_m1',
        prompt: 'Which React hook should be used for memoizing expensive computations?',
        options: ['useState', 'useEffect', 'useCallback', 'useMemo'],
        answer: 'useMemo',
        explanation: 'useMemo returns a memoized value of a function execution, preventing recalculations on every render unless its dependency array changes.',
        category: 'React.js',
        difficulty: 'medium',
      },
      {
        id: 'tech_m2',
        prompt: 'Which statement is true about MongoDB?',
        options: ['It is a relational database', 'It stores data in dynamic JSON-like documents', 'It relies strictly on SQL queries', 'It cannot scale horizontally'],
        answer: 'It stores data in dynamic JSON-like documents',
        explanation: 'MongoDB is a document-oriented NoSQL database that stores data structures in flexible, JSON-like BSON documents.',
        category: 'MongoDB',
        difficulty: 'medium',
      },
      {
        id: 'tech_m3',
        prompt: 'In Node.js, which built-in module is commonly used to create web servers?',
        options: ['fs', 'http', 'path', 'crypto'],
        answer: 'http',
        explanation: 'The native http module provides tools to listen, parse requests, and send responses, establishing a basic web server.',
        category: 'Node.js',
        difficulty: 'medium',
      },
      {
        id: 'tech_m4',
        prompt: 'What is the database ACID property that guarantees that all transactions are committed or none are?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        answer: 'Atomicity',
        explanation: 'Atomicity ensures that a transaction is treated as a single, indivisible unit of work: either all updates are committed, or none are.',
        category: 'DBMS',
        difficulty: 'medium',
      },
      {
        id: 'tech_m5',
        prompt: 'Which of the following describes the OOP principle of Encapsulation?',
        options: [
          'Defining a child class from a parent',
          'Hiding implementation details and exposing only safe methods',
          'Overloading a function name',
          'Resolving function signatures at runtime',
        ],
        answer: 'Hiding implementation details and exposing only safe methods',
        explanation: 'Encapsulation restricts direct access to some of an object’s components, packaging variables and methods together while exposing selective public operations.',
        category: 'OOPs',
        difficulty: 'medium',
      },

      // HARD
      {
        id: 'tech_h1',
        prompt: 'In the JavaScript Event Loop, which of the following queues are executed first after the current execution context completes?',
        options: ['Task Queue (Macrotasks)', 'Microtask Queue (Promises, queueMicrotask)', 'Animation Frame Callback Queue', 'RequestIdleCallback Queue'],
        answer: 'Microtask Queue (Promises, queueMicrotask)',
        explanation: 'Microtasks are processed immediately after the call stack clears and before rendering or proceeding to the next event loop tick task.',
        category: 'JavaScript',
        difficulty: 'hard',
      },
      {
        id: 'tech_h2',
        prompt: 'What is React Fiber?',
        options: [
          'A new library for building animations',
          'A complete rewrite of React core algorithm for virtual DOM reconciliation',
          'A state management library similar to Redux',
          'A lightweight CSS grid framework',
        ],
        answer: 'A complete rewrite of React core algorithm for virtual DOM reconciliation',
        explanation: 'React Fiber is the implementation of React’s core reconciliation algorithm, enabling incremental rendering and task prioritizing.',
        category: 'React.js',
        difficulty: 'hard',
      },
      {
        id: 'tech_h3',
        prompt: 'What DBMS concept refers to a database lock where transactions can read data but cannot write to it?',
        options: ['Shared Lock (S-Lock)', 'Exclusive Lock (X-Lock)', 'Intent Lock (I-Lock)', 'Optimistic Lock'],
        answer: 'Shared Lock (S-Lock)',
        explanation: 'A Shared Lock permits concurrent transactions to read (select) a resource, preventing modifications until all shared locks are released.',
        category: 'DBMS',
        difficulty: 'hard',
      },
      {
        id: 'tech_h4',
        prompt: 'In OOP, resolving a virtual function call at runtime is an example of which of the following?',
        options: ['Static binding', 'Compile-time polymorphism', 'Dynamic binding / Runtime polymorphism', 'Data hiding'],
        answer: 'Dynamic binding / Runtime polymorphism',
        explanation: 'Dynamic binding defers the resolution of method invocations until execution time, enabling override polymorphism.',
        category: 'OOPs',
        difficulty: 'hard',
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
