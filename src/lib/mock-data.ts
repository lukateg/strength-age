import { Question } from "@/app/app/tests/[testId]/page";

export const testData = {
  title: "JavaScript Fundamentals Quiz",
  description: "Test your knowledge of JavaScript basics.",
  questions: [
    {
      questionText: "What is JavaScript primarily used for?",
      questionType: "multiple_choice",
      availableAnswers: [
        "Creating static web pages",
        "Creating network-centric applications",
        "Server-side database management",
        "Desktop application development",
      ],
      correctAnswer: ["Creating network-centric applications"],
    },
    {
      questionText:
        "Which keyword is used to declare a variable in JavaScript?",
      questionType: "multiple_choice",
      availableAnswers: ["let", "const", "var", "declare"],
      correctAnswer: ["var"],
    },
    {
      questionText: "What does the // symbol represent in JavaScript code?",
      questionType: "short_answer",
      correctAnswer: ["A single-line comment"],
    },
    {
      questionText: "Is JavaScript case-sensitive?",
      questionType: "true_false",
      availableAnswers: ["True", "False"],
      correctAnswer: ["True"],
    },
    {
      questionText: 'What is the output of 10 + "5" in JavaScript?',
      questionType: "short_answer",
      correctAnswer: ["105"],
    },
    {
      questionText: "Which of the following is NOT a JavaScript data type?",
      questionType: "multiple_choice",
      availableAnswers: ["Number", "String", "Boolean", "Character"],
      correctAnswer: ["Character"],
    },
    {
      questionText: "What is the purpose of the document.write() function?",
      questionType: "short_answer",
      correctAnswer: ["To write text or HTML to the HTML document"],
    },
    {
      questionText:
        "Which operator is used to check if two values are equal in JavaScript?",
      questionType: "multiple_choice",
      availableAnswers: ["=", "==", "===", "!="],
      correctAnswer: ["=="],
    },
    {
      questionText: "Can JavaScript read or write files on the client-side?",
      questionType: "true_false",
      availableAnswers: ["True", "False"],
      correctAnswer: ["False"],
    },
    {
      questionText: "What does the typeof operator do in JavaScript?",
      questionType: "short_answer",
      correctAnswer: [
        "Returns a string indicating the data type of a variable",
      ],
    },
  ] as Question[],
};
