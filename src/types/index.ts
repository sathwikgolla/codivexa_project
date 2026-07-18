// User Types
export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  isBanned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  role: 'student';
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: Certificate[];
  wishlist: string[];
  progress: CourseProgress[];
}

export interface Instructor extends User {
  role: 'instructor';
  bio?: string;
  expertise: string[];
  courses: string[];
  totalStudents: number;
  totalRevenue: number;
  rating: number;
}

export interface Admin extends User {
  role: 'admin';
}

// Course Types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 'development' | 'design' | 'business' | 'marketing' | 'data-science' | 'ai-ml' | 'devops' | 'other';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  image?: string;
  coverImage?: string;
  instructorId: string;
  instructorName: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  price: number;
  originalPrice?: number;
  duration: number; // in minutes
  lessonsCount: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  language: string;
  requirements: string[];
  whatYouLearn: string[];
  lessons: Lesson[];
  quizzes: Quiz[];
  assignments: Assignment[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  youtubeUrl?: string;
  duration: number; // in minutes
  order: number;
  resources: Resource[];
  notes?: string;
  freePreview: boolean;
  completed?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'other';
  url: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  duration: number; // in minutes
  passingMarks: number;
  totalMarks: number;
  questions: Question[];
  attemptLimit: number;
  createdAt: Date;
}

export type QuestionType = 'mcq' | 'coding';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  marks: number;
  codeTemplate?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  courseId: string;
  answers: Record<string, string>;
  score: number;
  totalMarks: number;
  passed: boolean;
  timeTaken: number; // in minutes
  attemptNumber: number;
  completedAt: Date;
}

// Assignment Types
export interface Assignment {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  dueDate: Date;
  maxMarks: number;
  instructions: string[];
  attachments: Resource[];
  createdAt: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  submittedAt: Date;
  files: Resource[];
  marks?: number;
  feedback?: string;
  status: 'pending' | 'reviewed' | 'resubmit';
}

// Certificate Types
export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  completionDate: Date;
  certificateId: string;
  qrCode: string;
  issuedBy: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// Payment Types
export type PaymentMethod = 'upi' | 'debit-card' | 'credit-card' | 'wallet' | 'net-banking';

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  invoiceId: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  paymentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  tax: number;
  total: number;
  paidAt: Date;
}

// Progress Types
export interface CourseProgress {
  studentId: string;
  courseId: string;
  completedLessons: string[];
  completedQuizzes: string[];
  completedAssignments: string[];
  currentLessonIndex?: number;
  currentLessonId?: string;
  watchPercentage?: number | Record<string, number>;
  progressPercentage?: number;
  overallProgress: number; // percentage
  lastAccessed: Date;
  timeSpent: number; // in minutes
  completed?: boolean;
}

// Review Types
export interface Review {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Analytics Types
export interface DashboardAnalytics {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalRevenue: number;
  totalCertificates: number;
  totalEnrollments: number;
  recentPayments: Payment[];
  recentRegistrations: User[];
  recentCertificates: Certificate[];
  topSellingCourses: Course[];
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyEnrollments: { month: string; enrollments: number }[];
  coursePopularity: { courseName: string; enrollments: number }[];
}

// Form Types
export interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  price: number;
  originalPrice?: number;
  language: string;
  requirements: string[];
  whatYouLearn: string[];
  thumbnail: File | string;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  mobile: string;
  avatar?: File | string;
  address?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Search and Filter Types
export interface CourseFilters {
  category?: CourseCategory;
  difficulty?: DifficultyLevel;
  priceRange?: [number, number];
  rating?: number;
  search?: string;
  sortBy?: 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatar?: string;
  points: number;
  coursesCompleted: number;
  certificatesEarned: number;
}
