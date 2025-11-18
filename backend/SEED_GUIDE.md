# Seed Guide – Feedback Report System

The following guide helps you populate MongoDB with sample data so that the real test → result → feedback flow works end to end.

## 1. Sample Question Bank (12 questions)

Create a file named `sample-questions.json` with the array below. It contains a mix of MCQ, paragraph, and code questions.

```json
[
  {
    "questionText": "What does JSX stand for in React?",
    "type": "mcq",
    "topic": "React Basics",
    "difficulty": "Easy",
    "marks": 5,
    "options": [
      { "value": "Java Syntax Extension" },
      { "value": "JavaScript XML" },
      { "value": "JSON XML" },
      { "value": "Java Serialization X" }
    ],
    "correctAnswer": "JavaScript XML"
  },
  {
    "questionText": "Which hook lets you manage component state in React?",
    "type": "mcq",
    "topic": "React Basics",
    "difficulty": "Easy",
    "marks": 5,
    "options": [
      { "value": "useReducer" },
      { "value": "useMemo" },
      { "value": "useState" },
      { "value": "useLayoutEffect" }
    ],
    "correctAnswer": "useState"
  },
  {
    "questionText": "Explain the virtual DOM and why React uses it.",
    "type": "paragraph",
    "topic": "React Basics",
    "difficulty": "Medium",
    "marks": 8,
    "correctAnswer": "The virtual DOM is an in-memory representation of the real DOM. React uses it to diff changes efficiently and batch updates for better performance.",
    "keywords": ["diff", "performance", "batch", "update"]
  },
  {
    "questionText": "Describe the difference between var, let, and const in JavaScript.",
    "type": "paragraph",
    "topic": "JavaScript",
    "difficulty": "Medium",
    "marks": 8,
    "correctAnswer": "var is function-scoped and hoisted, let/const are block-scoped. const prevents reassignment, let allows reassignment."
  },
  {
    "questionText": "Implement a JavaScript function to check if a string is a palindrome.",
    "type": "code",
    "topic": "JavaScript",
    "difficulty": "Medium",
    "marks": 10,
    "correctAnswer": "reverse string and compare original",
    "expectedOutput": "isPalindrome('racecar') === true"
  },
  {
    "questionText": "Write a function to compute factorial of a number recursively.",
    "type": "code",
    "topic": "DSA",
    "difficulty": "Medium",
    "marks": 10,
    "correctAnswer": "recursive function with base case",
    "expectedOutput": "factorial(5) === 120"
  },
  {
    "questionText": "Which operating system concept prevents multiple processes from accessing the same resource simultaneously?",
    "type": "mcq",
    "topic": "Operating Systems",
    "difficulty": "Medium",
    "marks": 5,
    "options": [
      { "value": "Deadlock" },
      { "value": "Mutual Exclusion" },
      { "value": "Thrashing" },
      { "value": "Paging" }
    ],
    "correctAnswer": "Mutual Exclusion"
  },
  {
    "questionText": "Explain what a deadlock is in operating systems and list its necessary conditions.",
    "type": "paragraph",
    "topic": "Operating Systems",
    "difficulty": "Hard",
    "marks": 10,
    "correctAnswer": "Deadlock occurs when processes wait indefinitely for resources held by each other. Necessary conditions are mutual exclusion, hold and wait, no preemption, circular wait."
  },
  {
    "questionText": "What is prototypal inheritance in JavaScript?",
    "type": "paragraph",
    "topic": "JavaScript",
    "difficulty": "Easy",
    "marks": 6,
    "correctAnswer": "Objects inherit directly from other objects via the prototype chain, sharing behaviour without classical classes.",
    "keywords": ["prototype", "inherit", "chain"]
  },
  {
    "questionText": "Write a function to reverse a singly linked list.",
    "type": "code",
    "topic": "DSA",
    "difficulty": "Hard",
    "marks": 12,
    "correctAnswer": "iterative pointer reversal",
    "expectedOutput": "reverseList([1,2,3]) => [3,2,1]"
  },
  {
    "questionText": "Which OOPS principle allows objects to be treated as instances of their parent class?",
    "type": "mcq",
    "topic": "OOPS",
    "difficulty": "Easy",
    "marks": 5,
    "options": [
      { "value": "Encapsulation" },
      { "value": "Inheritance" },
      { "value": "Polymorphism" },
      { "value": "Abstraction" }
    ],
    "correctAnswer": "Polymorphism"
  },
  {
    "questionText": "Explain the SOLID principles and why they matter in system design.",
    "type": "paragraph",
    "topic": "OOPS",
    "difficulty": "Hard",
    "marks": 12,
    "correctAnswer": "SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion; they encourage maintainable, extensible object-oriented design."
  }
]
```

## 2. Sample Tests (2 static assessments)

After inserting questions, capture the generated ObjectIds. Use the IDs to build the test documents below (replace the placeholders with real ObjectIds).

```json
[
  {
    "title": "Frontend Fundamentals Assessment",
    "description": "Evaluates core React and JavaScript knowledge",
    "durationMinutes": 45,
    "questionIds": ["<Q1>", "<Q2>", "<Q3>", "<Q4>", "<Q5>", "<Q11>"],
    "tags": ["frontend", "react", "javascript"]
  },
  {
    "title": "Systems & Data Structures Challenge",
    "description": "Mixed bag of OS theory and algorithmic coding",
    "durationMinutes": 60,
    "questionIds": ["<Q6>", "<Q7>", "<Q8>", "<Q9>", "<Q10>", "<Q12>"],
    "tags": ["systems", "dsa"]
  }
]
```

## 3. Seeding Instructions

1. **Ensure environment variables are configured**

   ```bash
   cd backend
   cp .env.example .env
   # Update MONGO_URI / FRONTEND_URL as needed
   ```

2. **Insert questions**

   ```bash
   mongosh "your-mongodb-connection-uri" --file insert-questions.js
   ```

   Where `insert-questions.js` contains:

   ```javascript
   const questions = JSON.parse(cat("sample-questions.json"));
   const result = db.questions.insertMany(questions);
   printjson(result.insertedIds);
   ```

3. **Insert tests**

   - Replace `<Qx>` placeholders inside the sample tests array with the IDs printed in the previous step.
   - Save as `sample-tests.json` and run:
     ```javascript
     const tests = JSON.parse(cat("sample-tests.json"));
     tests.forEach((test) => {
       test.questionIds = test.questionIds.map((id) => ObjectId(id));
       const totalMarks = db.questions
         .find({ _id: { $in: test.questionIds } })
         .toArray()
         .reduce((sum, q) => sum + (q.marks || 0), 0);
       db.tests.insertOne({
         title: test.title,
         description: test.description,
         questions: test.questionIds,
         durationMinutes: test.durationMinutes,
         totalMarks,
         tags: test.tags,
         createdAt: new Date(),
         updatedAt: new Date(),
       });
     });
     ```

4. **Verify counts**

   ```javascript
   db.questions.countDocuments();
   db.tests.countDocuments();
   ```

5. **Run the backend and frontend**
   ```bash
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

## 4. Postman Test Flow

1. **Fetch available tests**

   - `GET {{API_BASE_URL}}/api/tests`
   - Confirm you see the two seeded tests and note the `_id` of the one to take.

2. **Fetch test details with questions**

   - `GET {{API_BASE_URL}}/api/tests/{{testId}}`
   - Response includes questions, marks, and types.

3. **Submit a test result**

   - `POST {{API_BASE_URL}}/api/test-results`
   - Body example:
     ```json
     {
       "userId": "candidate001",
       "testId": "{{testId}}",
       "answers": [
         { "questionId": "{{questionId1}}", "answer": "JavaScript XML" },
         { "questionId": "{{questionId2}}", "answer": "useState" }
         // continue for each question
       ]
     }
     ```
   - Save the returned `_id` as `testResultId`.

4. **Generate feedback**

   - `POST {{API_BASE_URL}}/api/feedback/report`
   - Body: `{ "testResultId": "{{testResultId}}" }`
   - Response is the feedback report saved to MongoDB.

5. **Fetch report by ID**

   - `GET {{API_BASE_URL}}/api/feedback/report/{{reportId}}`

6. **(Optional) Fetch recent reports for a user**

   - `GET {{API_BASE_URL}}/api/feedback/user/candidate001`

7. **(Optional) Inspect original submitted answers**
   - `GET {{API_BASE_URL}}/api/feedback/report/{{reportId}}/test-data`

## 5. End-to-End Flow Recap

1. Seed `questions` and `tests` collections.
2. Start backend (`npm run dev`) and frontend (`npm run dev`).
3. Visit `http://localhost:3000/feedback-test` to experience the full flow:
   - Select a seeded test.
   - Answer questions and submit.
   - View the generated feedback report.

Once seeded, users interact with real database-driven tests, test results are stored, and feedback reports reference the persisted `TestResult` documents.
