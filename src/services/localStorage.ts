import {
  User,
  Student,
  Instructor,
  Admin,
  Course,
  Lesson,
  Quiz,
  QuizAttempt,
  Assignment,
  AssignmentSubmission,
  Certificate,
  Payment,
  Invoice,
  CourseProgress,
  Review,
  Notification,
  DashboardAnalytics,
  LeaderboardEntry,
} from '@/types';

const STORAGE_KEYS = {
  USERS: 'codivexa_users',
  COURSES: 'codivexa_courses',
  PAYMENTS: 'codivexa_payments',
  INVOICES: 'codivexa_invoices',
  CERTIFICATES: 'codivexa_certificates',
  QUIZ_ATTEMPTS: 'codivexa_quiz_attempts',
  ASSIGNMENT_SUBMISSIONS: 'codivexa_assignment_submissions',
  REVIEWS: 'codivexa_reviews',
  NOTIFICATIONS: 'codivexa_notifications',
  CURRENT_USER: 'codivexa_current_user',
  THEME: 'codivexa_theme',
  COURSE_PROGRESS: 'codivexa_course_progress',
};

class LocalStorageService {
  // Generic methods
  private get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (key, value) => {
      if (key.endsWith('At') || key === 'createdAt' || key === 'updatedAt' || key === 'dueDate' || key === 'completedAt' || key === 'paidAt' || key === 'lastAccessed') {
        return new Date(value);
      }
      return value;
    }) : [];
  }

  private set<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // User methods
  getUsers(): User[] {
    return this.get<User>(STORAGE_KEYS.USERS);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(user => user.email === email);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.set(STORAGE_KEYS.USERS, users);
  }

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date() };
      this.set(STORAGE_KEYS.USERS, users);
    }
  }

  deleteUser(id: string): void {
    const users = this.getUsers().filter(user => user.id !== id);
    this.set(STORAGE_KEYS.USERS, users);
  }

  // Course methods
  getCourses(): Course[] {
    return this.get<Course>(STORAGE_KEYS.COURSES);
  }

  getCourseById(id: string): Course | undefined {
    return this.getCourses().find(course => course.id === id);
  }

  getCoursesByInstructor(instructorId: string): Course[] {
    return this.getCourses().filter(course => course.instructorId === instructorId);
  }

  addCourse(course: Course): void {
    const courses = this.getCourses();
    courses.push(course);
    this.set(STORAGE_KEYS.COURSES, courses);
  }

  updateCourse(id: string, updates: Partial<Course>): void {
    const courses = this.getCourses();
    const index = courses.findIndex(course => course.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates, updatedAt: new Date() };
      this.set(STORAGE_KEYS.COURSES, courses);
    }
  }

  deleteCourse(id: string): void {
    const courses = this.getCourses().filter(course => course.id !== id);
    this.set(STORAGE_KEYS.COURSES, courses);
  }

  // Payment methods
  getPayments(): Payment[] {
    return this.get<Payment>(STORAGE_KEYS.PAYMENTS);
  }

  getPaymentsByStudent(studentId: string): Payment[] {
    return this.getPayments().filter(payment => payment.studentId === studentId);
  }

  getPaymentsByCourse(courseId: string): Payment[] {
    return this.getPayments().filter(payment => payment.courseId === courseId);
  }

  addPayment(payment: Payment): void {
    const payments = this.getPayments();
    payments.push(payment);
    this.set(STORAGE_KEYS.PAYMENTS, payments);
  }

  updatePayment(id: string, updates: Partial<Payment>): void {
    const payments = this.getPayments();
    const index = payments.findIndex(payment => payment.id === id);
    if (index !== -1) {
      payments[index] = { ...payments[index], ...updates };
      this.set(STORAGE_KEYS.PAYMENTS, payments);
    }
  }

  // Invoice methods
  getInvoices(): Invoice[] {
    return this.get<Invoice>(STORAGE_KEYS.INVOICES);
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.getInvoices().find(invoice => invoice.id === id);
  }

  addInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    invoices.push(invoice);
    this.set(STORAGE_KEYS.INVOICES, invoices);
  }

  // Certificate methods
  getCertificates(): Certificate[] {
    return this.get<Certificate>(STORAGE_KEYS.CERTIFICATES);
  }

  getCertificatesByStudent(studentId: string): Certificate[] {
    return this.getCertificates().filter(certificate => certificate.studentId === studentId);
  }

  getCertificateById(id: string): Certificate | undefined {
    return this.getCertificates().find(certificate => certificate.id === id);
  }

  addCertificate(certificate: Certificate): void {
    const certificates = this.getCertificates();
    certificates.push(certificate);
    this.set(STORAGE_KEYS.CERTIFICATES, certificates);
  }

  // Quiz Attempt methods
  getQuizAttempts(): QuizAttempt[] {
    return this.get<QuizAttempt>(STORAGE_KEYS.QUIZ_ATTEMPTS);
  }

  getQuizAttemptsByStudent(studentId: string): QuizAttempt[] {
    return this.getQuizAttempts().filter(attempt => attempt.studentId === studentId);
  }

  getQuizAttemptsByQuiz(quizId: string): QuizAttempt[] {
    return this.getQuizAttempts().filter(attempt => attempt.quizId === quizId);
  }

  addQuizAttempt(attempt: QuizAttempt): void {
    const attempts = this.getQuizAttempts();
    attempts.push(attempt);
    this.set(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);
  }

  // Assignment Submission methods
  getAssignmentSubmissions(): AssignmentSubmission[] {
    return this.get<AssignmentSubmission>(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS);
  }

  getSubmissionsByStudent(studentId: string): AssignmentSubmission[] {
    return this.getAssignmentSubmissions().filter(sub => sub.studentId === studentId);
  }

  getSubmissionsByAssignment(assignmentId: string): AssignmentSubmission[] {
    return this.getAssignmentSubmissions().filter(sub => sub.assignmentId === assignmentId);
  }

  addSubmission(submission: AssignmentSubmission): void {
    const submissions = this.getAssignmentSubmissions();
    submissions.push(submission);
    this.set(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, submissions);
  }

  updateSubmission(id: string, updates: Partial<AssignmentSubmission>): void {
    const submissions = this.getAssignmentSubmissions();
    const index = submissions.findIndex(sub => sub.id === id);
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...updates };
      this.set(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, submissions);
    }
  }

  // Review methods
  getReviews(): Review[] {
    return this.get<Review>(STORAGE_KEYS.REVIEWS);
  }

  getReviewsByCourse(courseId: string): Review[] {
    return this.getReviews().filter(review => review.courseId === courseId);
  }

  getReviewsByStudent(studentId: string): Review[] {
    return this.getReviews().filter(review => review.studentId === studentId);
  }

  addReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.push(review);
    this.set(STORAGE_KEYS.REVIEWS, reviews);
  }

  // Notification methods
  getNotifications(): Notification[] {
    return this.get<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  }

  getNotificationsByUser(userId: string): Notification[] {
    return this.getNotifications().filter(notification => notification.userId === userId);
  }

  addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.push(notification);
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(notif => notif.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  // Current user session
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user, (key, value) => {
      if (key.endsWith('At') || key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    }) : null;
  }

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Theme
  getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme: 'light' | 'dark'): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Analytics
  getDashboardAnalytics(): DashboardAnalytics {
    const users = this.getUsers();
    const courses = this.getCourses();
    const payments = this.getPayments();
    const certificates = this.getCertificates();
    const completedPayments = payments.filter(p => p.status === 'completed');

    const students = users.filter(u => u.role === 'student');
    const instructors = users.filter(u => u.role === 'instructor');

    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalEnrollments = students.reduce((sum, s) => {
     const student = s as Student;
      return sum + (student.enrolledCourses?.length || 0);
    }, 0);

    return {
      totalStudents: students.length,
      totalInstructors: instructors.length,
      totalCourses: courses.length,
      totalRevenue,
      totalCertificates: certificates.length,
      totalEnrollments,
      recentPayments: completedPayments.slice(-10).reverse(),
      recentRegistrations: users.slice(-10).reverse(),
      recentCertificates: certificates.slice(-10).reverse(),
      topSellingCourses: courses
        .map(course => ({
          ...course,
          enrollmentCount: completedPayments.filter(p => p.courseId === course.id).length,
        }))
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 5),
      monthlyRevenue: [],
      monthlyEnrollments: [],
      coursePopularity: courses
        .map(course => ({
          courseName: course.title,
          enrollments: completedPayments.filter(p => p.courseId === course.id).length,
        }))
        .sort((a, b) => b.enrollments - a.enrollments)
        .slice(0, 10),
    };
  }

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    const students = this.getUsers().filter(u => u.role === 'student') as Student[];
    const certificates = this.getCertificates();

    return students
      .map(student => {
        const studentCertificates = certificates.filter(c => c.studentId === student.id);
        return {
          rank: 0,
          studentId: student.id,
          studentName: student.fullName,
          avatar: student.avatar,
          points: studentCertificates.length * 100 + (student.completedCourses?.length || 0) * 50,
          coursesCompleted: student.completedCourses?.length || 0,
          certificatesEarned: studentCertificates.length,
        };
      })
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, 20);
  }

  // Course Progress methods
  getCourseProgressList(): CourseProgress[] {
    return this.get<CourseProgress>(STORAGE_KEYS.COURSE_PROGRESS);
  }

  getCourseProgressByStudent(studentId: string): CourseProgress[] {
    return this.getCourseProgressList().filter(progress => progress.studentId === studentId);
  }

  getCourseProgressByCourse(courseId: string): CourseProgress[] {
    return this.getCourseProgressList().filter(progress => progress.courseId === courseId);
  }

  getCourseProgress(studentId: string, courseId: string): CourseProgress | undefined {
    return this.getCourseProgressList().find(
      progress => progress.studentId === studentId && progress.courseId === courseId
    );
  }

  addCourseProgress(progress: CourseProgress): void {
    const progressList = this.getCourseProgressList();
    progressList.push(progress);
    this.set(STORAGE_KEYS.COURSE_PROGRESS, progressList);
  }

  updateCourseProgress(studentId: string, courseId: string, updates: Partial<CourseProgress>): void {
    const progressList = this.getCourseProgressList();
    const index = progressList.findIndex(
      p => p.studentId === studentId && p.courseId === courseId
    );
    if (index !== -1) {
      progressList[index] = { ...progressList[index], ...updates, lastAccessed: new Date() };
      this.set(STORAGE_KEYS.COURSE_PROGRESS, progressList);
    }
  }

  deleteCourseProgress(studentId: string, courseId: string): void {
    const progressList = this.getCourseProgressList().filter(
      p => !(p.studentId === studentId && p.courseId === courseId)
    );
    this.set(STORAGE_KEYS.COURSE_PROGRESS, progressList);
  }

  // Clear all data (for testing)
  clearAll(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const localStorageService = new LocalStorageService();
