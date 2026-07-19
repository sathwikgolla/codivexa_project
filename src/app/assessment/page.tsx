'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { Button, Card, CardBody, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  type: 'mcq' | 'coding';
  question: string;
  options?: string[];
  correctAnswer: string;
  codeSnippet?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

export default function AssessmentPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; totalMarks: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  const sampleQuiz: Quiz = {
    id: 'assessment-1',
    title: 'General Knowledge Assessment',
    description: 'Test your general knowledge and problem-solving skills',
    duration: 600, // 10 minutes in seconds
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'Which programming language is known for its simplicity and readability?',
        options: ['Java', 'Python', 'C++', 'Assembly'],
        correctAnswer: 'Python',
      },
      {
        id: 'q3',
        type: 'mcq',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
        correctAnswer: 'Hyper Text Markup Language',
      },
      {
        id: 'q4',
        type: 'mcq',
        question: 'Which data structure follows the Last In First Out (LIFO) principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 'Stack',
      },
      {
        id: 'q5',
        type: 'mcq',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        correctAnswer: 'O(log n)',
      },
    ],
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [isAuthenticated, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizSubmitted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(sampleQuiz.duration);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    sampleQuiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = correctCount;
    const totalMarks = sampleQuiz.questions.length;
    const passed = score >= totalMarks * 0.6;

    setResult({ score, totalMarks, passed });
    setQuizSubmitted(true);
    setQuizStarted(false);
    
    // Log the attempt
    import('@/services/localStorage').then(({ localStorageService }) => {
      localStorageService.incrementAssessmentAttempts();
    });

    if (passed) {
      toast.success('Assessment completed successfully!');
    } else {
      toast.error('Assessment failed. Please try again.');
    }
  };

  const retakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setResult(null);
    setTimeLeft(sampleQuiz.duration);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quizStarted && !quizSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {sampleQuiz.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {sampleQuiz.description}
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(sampleQuiz.duration / 60)} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{sampleQuiz.questions.length} questions</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Instructions:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Read each question carefully before answering</li>
                    <li>• You can navigate between questions using Next/Previous buttons</li>
                    <li>• The timer will automatically submit when it reaches zero</li>
                    <li>• You need at least 60% correct answers to pass</li>
                    <li>• Once submitted, you cannot change your answers</li>
                  </ul>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Play className="w-5 h-5" />}
                  onClick={startQuiz}
                >
                  Start Assessment
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizSubmitted && result) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${result.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {result.passed ? (
                      <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    You scored {result.score} out of {result.totalMarks}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Score</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round((result.score / result.totalMarks) * 100)}%
                    </span>
                  </div>
                  <ProgressBar value={(result.score / result.totalMarks) * 100} color={result.passed ? 'green' : 'red'} />
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Answer Review:</h3>
                  {sampleQuiz.questions.map((question, index) => {
                    const userAnswer = selectedAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                      <div key={question.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {index + 1}. {question.question}
                            </p>
                            <div className="text-sm">
                              <p className="text-gray-600 dark:text-gray-400">
                                Your answer: <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{userAnswer || 'Not answered'}</span>
                              </p>
                              {!isCorrect && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  Correct answer: <span className="text-green-600 dark:text-green-400">{question.correctAnswer}</span>
                                </p>
                              )}
                            </div>
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
                    fullWidth
                    icon={<RotateCcw className="w-5 h-5" />}
                    onClick={retakeQuiz}
                  >
                    Retake Assessment
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button variant="primary" size="lg" fullWidth>
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = sampleQuiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit Assessment
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardBody className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Question {currentQuestionIndex + 1} of {sampleQuiz.questions.length}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sampleQuiz.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <ProgressBar value={((currentQuestionIndex + 1) / sampleQuiz.questions.length) * 100} showLabel size="sm" />
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.type === 'mcq' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          selectedAnswers[currentQuestion.id] === option
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentQuestion.id] === option
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedAnswers[currentQuestion.id] === option && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900 dark:text-white">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQuestion.id]}
                >
                  {currentQuestionIndex === sampleQuiz.questions.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
