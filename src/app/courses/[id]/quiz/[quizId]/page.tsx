'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft,
  AlertCircle, Trophy, RotateCcw, BarChart3
} from 'lucide-react';
import { Button, Card, CardBody, Badge, ProgressBar } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Quiz, Question, QuizAttempt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; totalMarks: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // In a real app, you would fetch the quiz by ID
    // For now, we'll create a sample quiz
    const sampleQuiz: Quiz = {
      id: params.quizId as string,
      courseId: params.id as string,
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics',
      duration: 15, // 15 minutes
      passingMarks: 70,
      totalMarks: 100,
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          question: 'What is React primarily used for?',
          options: ['Database management', 'Building user interfaces', 'Server-side logic', 'Machine learning'],
          correctAnswer: 'Building user interfaces',
          explanation: 'React is a JavaScript library for building user interfaces, particularly for web applications.',
          marks: 20,
        },
        {
          id: 'q2',
          type: 'mcq',
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 'useState',
          explanation: 'useState is the hook used to add state to functional components in React.',
          marks: 20,
        },
        {
          id: 'q3',
          type: 'mcq',
          question: 'What is JSX?',
          options: ['A JavaScript extension', 'A CSS framework', 'A database query language', 'A testing tool'],
          correctAnswer: 'A JavaScript extension',
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
          marks: 20,
        },
        {
          id: 'q4',
          type: 'mcq',
          question: 'Which method is used to handle side effects in React?',
          options: ['useState', 'useEffect', 'useContext', 'useMemo'],
          correctAnswer: 'useEffect',
          explanation: 'useEffect is used to handle side effects in functional components, such as data fetching or subscriptions.',
          marks: 20,
        },
        {
          id: 'q5',
          type: 'mcq',
          question: 'What is the virtual DOM?',
          options: ['A real DOM element', 'A lightweight copy of the real DOM', 'A CSS technique', 'A database'],
          correctAnswer: 'A lightweight copy of the real DOM',
          explanation: 'The virtual DOM is a lightweight JavaScript representation of the real DOM that React uses for efficient updates.',
          marks: 20,
        },
      ],
      attemptLimit: 3,
      createdAt: new Date(),
    };

    setQuiz(sampleQuiz);
    setTimeLeft(sampleQuiz.duration * 60); // Convert to seconds
    setLoading(false);
  }, [isAuthenticated, params.id, params.quizId, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !quizSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizSubmitted]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz || !user) return;

    let score = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.marks;
      }
    });

    const passed = score >= quiz.passingMarks;
    setResult({ score, totalMarks: quiz.totalMarks, passed });
    setQuizSubmitted(true);

    // Save quiz attempt
    const attempt: QuizAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: quiz.id,
      studentId: user.id,
      courseId: quiz.courseId,
      answers,
      score,
      totalMarks: quiz.totalMarks,
      passed,
      timeTaken: quiz.duration * 60 - timeLeft,
      attemptNumber: 1,
      completedAt: new Date(),
    };

    localStorageService.addQuizAttempt(attempt);

    if (passed) {
      toast.success('Congratulations! You passed the quiz!');
    } else {
      toast.error('You did not pass. Try again!');
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(quiz!.duration * 60);
    setQuizStarted(false);
    setQuizSubmitted(false);
    setResult(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Not Found
          </h2>
          <Link href={`/courses/${params.id}/learn`}>
            <Button variant="primary">Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {!quizStarted ? (
          // Quiz Start Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {quiz.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quiz.duration} min</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quiz.totalMarks}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Passing Marks</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quiz.passingMarks}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Quiz Instructions:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Read each question carefully before answering</li>
                    <li>• You cannot change your answer after submission</li>
                    <li>• The quiz will auto-submit when time runs out</li>
                    <li>• You need {quiz.passingMarks}% marks to pass</li>
                  </ul>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setQuizStarted(true)}
                  >
                    Start Quiz
                  </Button>
                  <Link href={`/courses/${params.id}/learn`}>
                    <Button variant="outline" size="lg">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : quizSubmitted ? (
          // Quiz Result Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    result?.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {result?.passed ? (
                      <Trophy className="w-12 h-12 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {result?.passed ? 'Congratulations!' : 'Better Luck Next Time!'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {result?.passed ? 'You have successfully passed the quiz' : 'You did not meet the passing criteria'}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Your Score</p>
                    <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      {result?.score} / {result?.totalMarks}
                    </p>
                    <Badge variant={result?.passed ? 'success' : 'danger'}>
                      {result?.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Answer Review:</h3>
                  {quiz.questions.map((question, index) => {
                    const isCorrect = answers[question.id] === question.correctAnswer;
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border ${
                          isCorrect
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {index + 1}. {question.question}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {answers[question.id] || 'Not answered'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Correct answer: <span className="text-green-600">{question.correctAnswer}</span>
                              </p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<RotateCcw className="w-5 h-5" />}
                    onClick={handleRetake}
                  >
                    Retake Quiz
                  </Button>
                  <Link href={`/courses/${params.id}/learn`}>
                    <Button variant="primary" size="lg">
                      Back to Course
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : (
          // Quiz Questions Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {quiz.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className={`text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <ProgressBar value={progress} showLabel size="sm" className="mb-6" />

            {/* Question Card */}
            <Card>
              <CardBody className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <Badge variant="info" className="mb-4">
                        {currentQuestion.marks} marks
                      </Badge>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {currentQuestion.question}
                      </h2>
                    </div>

                    {currentQuestion.type === 'mcq' && currentQuestion.options && (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              answers[currentQuestion.id] === option
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                answers[currentQuestion.id] === option
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}>
                                {answers[currentQuestion.id] === option && (
                                  <div className="w-3 h-3 bg-white rounded-full" />
                                )}
                              </div>
                              <span className="text-gray-900 dark:text-white">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    icon={<ArrowLeft className="w-5 h-5" />}
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!answers[currentQuestion.id]}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      disabled={!answers[currentQuestion.id]}
                      icon={<ArrowRight className="w-5 h-5" />}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
