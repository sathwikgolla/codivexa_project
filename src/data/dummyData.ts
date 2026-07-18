import {
  User,
  Student,
  Instructor,
  Admin,
  Course,
  Lesson,
  Quiz,
  Question,
  Assignment,
  Payment,
  Certificate,
  Review,
  Notification,
  CourseCategory,
  DifficultyLevel,
  PaymentMethod,
} from '@/types';
import { localStorageService } from '@/services/localStorage';

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate dummy students
export const generateDummyStudents = (): Student[] => {
  const students: Student[] = [
    {
      id: generateId(),
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      mobile: '+1234567890',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      address: '123 Main St, New York, NY 10001',
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: generateId(),
      fullName: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      mobile: '+1234567891',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20'),
    },
    {
      id: generateId(),
      fullName: 'Michael Brown',
      email: 'michael.brown@example.com',
      mobile: '+1234567892',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      address: '789 Pine Rd, Chicago, IL 60601',
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10'),
    },
    {
      id: generateId(),
      fullName: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      mobile: '+1234567893',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      address: '321 Elm St, Houston, TX 77001',
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date('2024-04-05'),
      updatedAt: new Date('2024-04-05'),
    },
    {
      id: generateId(),
      fullName: 'David Wilson',
      email: 'david.wilson@example.com',
      mobile: '+1234567894',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      address: '654 Maple Dr, Phoenix, AZ 85001',
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date('2024-05-12'),
      updatedAt: new Date('2024-05-12'),
    },
  ];

  // Add more students
  for (let i = 6; i <= 20; i++) {
    students.push({
      id: generateId(),
      fullName: `Student ${i}`,
      email: `student${i}@example.com`,
      mobile: `+12345678${90 + i}`,
      password: 'password123',
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i}`,
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date(`2024-0${(i % 12) + 1}-15`),
      updatedAt: new Date(`2024-0${(i % 12) + 1}-15`),
    });
  }

  return students;
};

// Generate dummy instructors
export const generateDummyInstructors = (): Instructor[] => {
  return [
    {
      id: generateId(),
      fullName: 'Dr. Robert Chen',
      email: 'robert.chen@example.com',
      mobile: '+1987654321',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      bio: 'Senior Software Engineer with 15+ years of experience in full-stack development. Previously worked at Google and Microsoft.',
      expertise: ['React', 'Node.js', 'TypeScript', 'System Design'],
      courses: [],
      totalStudents: 0,
      totalRevenue: 0,
      rating: 4.8,
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-01'),
    },
    {
      id: generateId(),
      fullName: 'Prof. Maria Garcia',
      email: 'maria.garcia@example.com',
      mobile: '+1987654322',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      bio: 'Data Science expert with PhD in Machine Learning. Published researcher and industry consultant.',
      expertise: ['Python', 'Machine Learning', 'Data Science', 'Deep Learning'],
      courses: [],
      totalStudents: 0,
      totalRevenue: 0,
      rating: 4.9,
      createdAt: new Date('2023-07-15'),
      updatedAt: new Date('2023-07-15'),
    },
    {
      id: generateId(),
      fullName: 'James Anderson',
      email: 'james.anderson@example.com',
      mobile: '+1987654323',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      bio: 'UI/UX Designer with 10+ years of experience. Worked with Fortune 500 companies.',
      expertise: ['Figma', 'UI Design', 'UX Research', 'Design Systems'],
      courses: [],
      totalStudents: 0,
      totalRevenue: 0,
      rating: 4.7,
      createdAt: new Date('2023-08-20'),
      updatedAt: new Date('2023-08-20'),
    },
    {
      id: generateId(),
      fullName: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@example.com',
      mobile: '+1987654324',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      bio: 'Cloud Architecture expert. AWS certified solutions architect.',
      expertise: ['AWS', 'Azure', 'DevOps', 'Kubernetes'],
      courses: [],
      totalStudents: 0,
      totalRevenue: 0,
      rating: 4.6,
      createdAt: new Date('2023-09-10'),
      updatedAt: new Date('2023-09-10'),
    },
    {
      id: generateId(),
      fullName: 'Mark Williams',
      email: 'mark.williams@example.com',
      mobile: '+1987654325',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
      bio: 'Mobile development specialist. iOS and Android expert.',
      expertise: ['React Native', 'Flutter', 'iOS', 'Android'],
      courses: [],
      totalStudents: 0,
      totalRevenue: 0,
      rating: 4.8,
      createdAt: new Date('2023-10-05'),
      updatedAt: new Date('2023-10-05'),
    },
  ];
};

// Generate dummy lessons with YouTube videos
const generateLessons = (courseTitle: string, courseId: string, count: number): Lesson[] => {
  const youtubeVideos = {
    'Complete React Developer Course 2024': [
      'https://www.youtube.com/embed/w7ejDZ8SWv8', // React Tutorial
      'https://www.youtube.com/embed/SqcY0GlETPk', // React Hooks
      'https://www.youtube.com/embed/am5iO1l8dL4', // React Router
      'https://www.youtube.com/embed/Ke90Tje7VS0', // Redux
      'https://www.youtube.com/embed/2LhoC9j-3VY', // React Context
    ],
    'Machine Learning A-Z: Python & R': [
      'https://www.youtube.com/embed/ukzFI9vW8UQ', // ML Tutorial
      'https://www.youtube.com/embed/aircAruvnKk', // Neural Networks
      'https://www.youtube.com/embed/Ilg3g1ew7LQ', // Deep Learning
      'https://www.youtube.com/embed/tPYj3fLAJUM', // Python ML
      'https://www.youtube.com/embed/7eh4d6sabA0', // ML Basics
    ],
    'UI/UX Design Masterclass': [
      'https://www.youtube.com/embed/wkD8syjk0Yk', // Figma Tutorial
      'https://www.youtube.com/embed/843pKx6yQMY', // UI Design
      'https://www.youtube.com/embed/1Pk7pL0v8W8', // UX Research
      'https://www.youtube.com/embed/537Z9b-bFYg', // Design Systems
      'https://www.youtube.com/embed/225A2bQeX4g', // Color Theory
    ],
    'AWS Certified Solutions Architect': [
      'https://www.youtube.com/embed/3hLmX_PpJww', // AWS Tutorial
      'https://www.youtube.com/embed/tz1aLw9_hqE', // EC2
      'https://www.youtube.com/embed/jpI1mV9QOMk', // S3
      'https://www.youtube.com/embed/5eW6E2x5r2A', // Lambda
      'https://www.youtube.com/embed/7rR1Mf2L5v4', // VPC
    ],
    'React Native - Build Mobile Apps': [
      'https://www.youtube.com/embed/0-S5a0eXPoc', // React Native Tutorial
      'https://www.youtube.com/embed/OnT4S24HjgQ', // React Navigation
      'https://www.youtube.com/embed/8kVv9aY5d3g', // React Native State
      'https://www.youtube.com/embed/2FZs3XJ-COM', // React Native Components
      'https://www.youtube.com/embed/6wfb7rK9p3Y', // React Native API
    ],
  };

  const courseVideos = youtubeVideos[courseTitle as keyof typeof youtubeVideos] || [];
  
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    courseId,
    order: i + 1,
    title: `${courseTitle} - Lesson ${i + 1}`,
    description: `Learn ${courseTitle} concepts in this comprehensive lesson covering fundamental and advanced topics.`,
    duration: 600 + (i * 120), // 10-20 minutes per lesson
    videoUrl: courseVideos[i % courseVideos.length] || '',
    freePreview: i === 0,
    resources: [
      {
        id: generateId(),
        title: 'Lesson Notes',
        type: 'pdf',
        url: '#',
      },
      {
        id: generateId(),
        title: 'Source Code',
        type: 'code',
        url: '#',
      },
    ],
  }));
};

// Generate dummy courses
export const generateDummyCourses = (instructors: Instructor[]): Course[] => {
  const categories: CourseCategory[] = ['development', 'design', 'business', 'marketing', 'data-science', 'ai-ml', 'devops', 'other'];
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  const reactCourseId = generateId();
  const mlCourseId = generateId();
  const designCourseId = generateId();
  const awsCourseId = generateId();
  const reactNativeCourseId = generateId();

  const courses: Course[] = [
    {
      id: reactCourseId,
      title: 'Complete React Developer Course 2024',
      description: 'Master React 18, Redux, React Router, and build production-ready applications. Learn hooks, context API, and modern React patterns.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      instructorId: instructors[0].id,
      instructorName: instructors[0].fullName,
      category: 'development',
      difficulty: 'intermediate',
      price: 99.99,
      originalPrice: 199.99,
      duration: 2400,
      lessonsCount: 45,
      rating: 4.8,
      reviewCount: 234,
      enrolledCount: 1520,
      language: 'English',
      requirements: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals', 'Computer with internet access'],
      whatYouLearn: ['Build modern React applications', 'Master React Hooks', 'State management with Redux', 'Testing React apps', 'Deployment strategies'],
      lessons: generateLessons('Complete React Developer Course 2024', reactCourseId, 5),
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: mlCourseId,
      title: 'Machine Learning A-Z: Python & R',
      description: 'Learn to create Machine Learning Algorithms in Python and R. Includes deep learning, neural networks, and practical projects.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      instructorId: instructors[1].id,
      instructorName: instructors[1].fullName,
      category: 'data-science',
      difficulty: 'intermediate',
      price: 129.99,
      originalPrice: 249.99,
      duration: 3600,
      lessonsCount: 60,
      rating: 4.9,
      reviewCount: 456,
      enrolledCount: 2340,
      language: 'English',
      requirements: ['Basic Python knowledge', 'Math fundamentals', 'Computer with 8GB RAM'],
      whatYouLearn: ['Machine Learning algorithms', 'Deep learning basics', 'Data preprocessing', 'Model evaluation', 'Real-world projects'],
      lessons: generateLessons('Machine Learning A-Z: Python & R', mlCourseId, 5),
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: designCourseId,
      title: 'UI/UX Design Masterclass',
      description: 'Complete guide to UI/UX design. Learn Figma, design thinking, user research, and create stunning interfaces.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      instructorId: instructors[2].id,
      instructorName: instructors[2].fullName,
      category: 'design',
      difficulty: 'beginner',
      price: 79.99,
      originalPrice: 149.99,
      duration: 1800,
      lessonsCount: 35,
      rating: 4.7,
      reviewCount: 189,
      enrolledCount: 980,
      language: 'English',
      requirements: ['No prior design experience needed', 'Figma account (free)', 'Creative mindset'],
      whatYouLearn: ['Design principles', 'Figma mastery', 'User research methods', 'Prototyping', 'Design systems'],
      lessons: generateLessons('UI/UX Design Masterclass', designCourseId, 5),
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: awsCourseId,
      title: 'AWS Certified Solutions Architect',
      description: 'Complete AWS certification preparation. Learn EC2, S3, Lambda, VPC, and all essential AWS services.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      instructorId: instructors[3].id,
      instructorName: instructors[3].fullName,
      category: 'devops',
      difficulty: 'advanced',
      price: 149.99,
      originalPrice: 299.99,
      duration: 3000,
      lessonsCount: 55,
      rating: 4.6,
      reviewCount: 312,
      enrolledCount: 1870,
      language: 'English',
      requirements: ['Basic IT knowledge', 'Linux fundamentals', 'AWS account (free tier)'],
      whatYouLearn: ['AWS core services', 'Architecture best practices', 'Security in AWS', 'Cost optimization', 'Exam preparation'],
      lessons: generateLessons('AWS Certified Solutions Architect', awsCourseId, 5),
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
    {
      id: reactNativeCourseId,
      title: 'React Native - Build Mobile Apps',
      description: 'Build iOS and Android apps with React Native. Learn navigation, state management, and publish to app stores.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      instructorId: instructors[4].id,
      instructorName: instructors[4].fullName,
      category: 'development',
      difficulty: 'intermediate',
      price: 89.99,
      originalPrice: 179.99,
      duration: 2100,
      lessonsCount: 40,
      rating: 4.8,
      reviewCount: 267,
      enrolledCount: 1340,
      language: 'English',
      requirements: ['React basics', 'JavaScript knowledge', 'Node.js installed'],
      whatYouLearn: ['React Native fundamentals', 'Navigation patterns', 'Native modules', 'App deployment', 'Performance optimization'],
      lessons: generateLessons('React Native - Build Mobile Apps', reactNativeCourseId, 5),
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: generateId(),
      title: 'Python for Data Science',
      description: 'Complete Python bootcamp for data science. Learn pandas, numpy, matplotlib, and real-world data analysis.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      instructorId: instructors[1].id,
      instructorName: instructors[1].fullName,
      category: 'data-science',
      difficulty: 'beginner',
      price: 69.99,
      originalPrice: 139.99,
      duration: 1500,
      lessonsCount: 30,
      rating: 4.7,
      reviewCount: 198,
      enrolledCount: 1120,
      language: 'English',
      requirements: ['No programming experience needed', 'Computer with Python installed'],
      whatYouLearn: ['Python fundamentals', 'Data manipulation', 'Data visualization', 'Statistical analysis', 'Real projects'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: generateId(),
      title: 'Digital Marketing Complete Guide',
      description: 'Master digital marketing strategies including SEO, social media, email marketing, and Google Ads.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      instructorId: instructors[0].id,
      instructorName: instructors[0].fullName,
      category: 'marketing',
      difficulty: 'beginner',
      price: 59.99,
      originalPrice: 119.99,
      duration: 1200,
      lessonsCount: 25,
      rating: 4.5,
      reviewCount: 145,
      enrolledCount: 890,
      language: 'English',
      requirements: ['Basic computer skills', 'Interest in marketing'],
      whatYouLearn: ['SEO fundamentals', 'Social media marketing', 'Email campaigns', 'Google Ads', 'Analytics'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01'),
    },
    {
      id: generateId(),
      title: 'TypeScript Masterclass',
      description: 'Learn TypeScript from scratch. Advanced types, generics, decorators, and building type-safe applications.',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      instructorId: instructors[0].id,
      instructorName: instructors[0].fullName,
      category: 'development',
      difficulty: 'intermediate',
      price: 79.99,
      originalPrice: 159.99,
      duration: 1400,
      lessonsCount: 32,
      rating: 4.8,
      reviewCount: 178,
      enrolledCount: 950,
      language: 'English',
      requirements: ['JavaScript knowledge', 'Basic programming concepts'],
      whatYouLearn: ['TypeScript fundamentals', 'Advanced types', 'Generics', 'Decorators', 'Type-safe development'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-04-15'),
    },
    {
      id: generateId(),
      title: 'Flutter App Development',
      description: 'Build beautiful mobile apps with Flutter and Dart. Cross-platform development made easy.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      instructorId: instructors[4].id,
      instructorName: instructors[4].fullName,
      category: 'development',
      difficulty: 'intermediate',
      price: 94.99,
      originalPrice: 189.99,
      duration: 2200,
      lessonsCount: 42,
      rating: 4.6,
      reviewCount: 156,
      enrolledCount: 780,
      language: 'English',
      requirements: ['Basic programming knowledge', 'Flutter installed', 'Dart basics'],
      whatYouLearn: ['Flutter fundamentals', 'Widget development', 'State management', 'API integration', 'App deployment'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01'),
    },
    {
      id: generateId(),
      title: 'Deep Learning with TensorFlow',
      description: 'Advanced deep learning course. Neural networks, CNNs, RNNs, and practical AI projects.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      instructorId: instructors[1].id,
      instructorName: instructors[1].fullName,
      category: 'ai-ml',
      difficulty: 'advanced',
      price: 159.99,
      originalPrice: 319.99,
      duration: 3200,
      lessonsCount: 58,
      rating: 4.9,
      reviewCount: 234,
      enrolledCount: 670,
      language: 'English',
      requirements: ['Python knowledge', 'Machine learning basics', 'Math fundamentals'],
      whatYouLearn: ['Deep learning concepts', 'Neural networks', 'CNNs and RNNs', 'TensorFlow', 'AI projects'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-05-15'),
    },
    {
      id: generateId(),
      title: 'Business Strategy & Management',
      description: 'Complete business management course. Strategy, leadership, operations, and entrepreneurship.',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      instructorId: instructors[0].id,
      instructorName: instructors[0].fullName,
      category: 'business',
      difficulty: 'intermediate',
      price: 84.99,
      originalPrice: 169.99,
      duration: 1600,
      lessonsCount: 38,
      rating: 4.4,
      reviewCount: 123,
      enrolledCount: 560,
      language: 'English',
      requirements: ['Interest in business', 'Basic management concepts'],
      whatYouLearn: ['Business strategy', 'Leadership skills', 'Operations management', 'Entrepreneurship', 'Case studies'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-01'),
    },
    {
      id: generateId(),
      title: 'Docker & Kubernetes Mastery',
      description: 'Container orchestration and deployment. Learn Docker, Kubernetes, and DevOps best practices.',
      thumbnail: 'https://images.unsplash.com/photo-1667429444926-4ea7e4a4753c?w=800',
      instructorId: instructors[3].id,
      instructorName: instructors[3].fullName,
      category: 'devops',
      difficulty: 'advanced',
      price: 119.99,
      originalPrice: 239.99,
      duration: 2600,
      lessonsCount: 48,
      rating: 4.7,
      reviewCount: 189,
      enrolledCount: 720,
      language: 'English',
      requirements: ['Linux basics', 'Command line knowledge', 'Docker installed'],
      whatYouLearn: ['Docker fundamentals', 'Kubernetes basics', 'Container orchestration', 'CI/CD pipelines', 'Production deployment'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-06-15'),
      updatedAt: new Date('2024-06-15'),
    },
    {
      id: generateId(),
      title: 'Graphic Design Fundamentals',
      description: 'Learn graphic design from scratch. Adobe Creative Suite, color theory, typography, and branding.',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b7993153b3d?w=800',
      instructorId: instructors[2].id,
      instructorName: instructors[2].fullName,
      category: 'design',
      difficulty: 'beginner',
      price: 64.99,
      originalPrice: 129.99,
      duration: 1300,
      lessonsCount: 28,
      rating: 4.5,
      reviewCount: 134,
      enrolledCount: 640,
      language: 'English',
      requirements: ['Creative mindset', 'Adobe Creative Suite access'],
      whatYouLearn: ['Design principles', 'Color theory', 'Typography', 'Adobe tools', 'Branding'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01'),
    },
    {
      id: generateId(),
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, MongoDB, and REST APIs.',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      instructorId: instructors[0].id,
      instructorName: instructors[0].fullName,
      category: 'development',
      difficulty: 'intermediate',
      price: 89.99,
      originalPrice: 179.99,
      duration: 2000,
      lessonsCount: 44,
      rating: 4.7,
      reviewCount: 201,
      enrolledCount: 1080,
      language: 'English',
      requirements: ['JavaScript knowledge', 'Basic backend concepts', 'Node.js installed'],
      whatYouLearn: ['Node.js fundamentals', 'Express framework', 'MongoDB', 'REST APIs', 'Authentication'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15'),
    },
    {
      id: generateId(),
      title: 'SEO Complete Course',
      description: 'Master search engine optimization. On-page, off-page, technical SEO, and link building strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd4?w=800',
      instructorId: instructors[0].id,
      instructorName: instructors[0].fullName,
      category: 'marketing',
      difficulty: 'beginner',
      price: 54.99,
      originalPrice: 109.99,
      duration: 1100,
      lessonsCount: 24,
      rating: 4.6,
      reviewCount: 112,
      enrolledCount: 520,
      language: 'English',
      requirements: ['Basic internet knowledge', 'Website access'],
      whatYouLearn: ['SEO fundamentals', 'On-page optimization', 'Off-page SEO', 'Technical SEO', 'Analytics'],
      lessons: [],
      quizzes: [],
      assignments: [],
      published: true,
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-08-01'),
    },
  ];

  return courses;
};

// Generate dummy payments
export const generateDummyPayments = (students: Student[], courses: Course[]): Payment[] => {
  const payments: Payment[] = [];
  const methods: PaymentMethod[] = ['upi', 'debit-card', 'credit-card', 'wallet', 'net-banking'];

  for (let i = 0; i < 50; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];

    payments.push({
      id: generateId(),
      studentId: student.id,
      courseId: course.id,
      amount: course.price,
      method,
      status: 'completed',
      transactionId: `TXN${Date.now()}${i}`,
      invoiceId: `INV${Date.now()}${i}`,
      createdAt: new Date(`2024-0${(i % 12) + 1}-${(i % 28) + 1}`),
    });
  }

  return payments;
};

// Generate dummy certificates
export const generateDummyCertificates = (students: Student[], courses: Course[]): Certificate[] => {
  const certificates: Certificate[] = [];

  for (let i = 0; i < 30; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];

    certificates.push({
      id: generateId(),
      studentId: student.id,
      studentName: student.fullName,
      courseId: course.id,
      courseName: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      completionDate: new Date(`2024-0${(i % 12) + 1}-${(i % 28) + 1}`),
      certificateId: `CERT-${Date.now()}-${i}`,
      qrCode: `QR-${Date.now()}-${i}`,
      issuedBy: 'Codivexa Learning Management System',
    });
  }

  return certificates;
};

// Generate dummy reviews
export const generateDummyReviews = (students: Student[], courses: Course[]): Review[] => {
  const reviews: Review[] = [];
  const comments = [
    'Excellent course! Very well structured and easy to follow.',
    'Great content and instructor. Learned a lot!',
    'Highly recommended for beginners.',
    'Advanced concepts explained clearly. Great value!',
    'Best course I have taken on this platform.',
    'Could use more practical examples, but overall good.',
    'Amazing instructor and comprehensive content.',
    'Perfect for my needs. Thank you!',
    'Well worth the investment.',
    'Clear explanations and good pacing.',
  ];

  for (let i = 0; i < 100; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];

    reviews.push({
      id: generateId(),
      courseId: course.id,
      studentId: student.id,
      studentName: student.fullName,
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
      comment: comments[Math.floor(Math.random() * comments.length)],
      createdAt: new Date(`2024-0${(i % 12) + 1}-${(i % 28) + 1}`),
    });
  }

  return reviews;
};

// Generate dummy notifications
export const generateDummyNotifications = (users: User[]): Notification[] => {
  const notifications: Notification[] = [];
  const types = ['success', 'error', 'warning', 'info'] as const;
  const titles = [
    'Course Enrollment Successful',
    'New Course Available',
    'Assignment Due Soon',
    'Certificate Issued',
    'Payment Received',
    'Course Updated',
    'Quiz Results Available',
    'New Message',
  ];
  const messages = [
    'You have successfully enrolled in the course.',
    'A new course matching your interests is now available.',
    'Your assignment is due in 2 days.',
    'Congratulations! Your certificate has been issued.',
    'Your payment has been processed successfully.',
    'The course content has been updated.',
    'Your quiz results are now available.',
    'You have a new message from your instructor.',
  ];

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];

    notifications.push({
      id: generateId(),
      userId: user.id,
      type: types[Math.floor(Math.random() * types.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      read: Math.random() > 0.5,
      createdAt: new Date(`2024-0${(i % 12) + 1}-${(i % 28) + 1}`),
    });
  }

  return notifications;
};

// Initialize all dummy data
export const initializeDummyData = () => {
  const instructors = generateDummyInstructors();
  const courses = generateDummyCourses(instructors);

  // Add admin users
  const admin: Admin = {
    id: generateId(),
    fullName: 'Admin User',
    email: 'admin@codivexa.com',
    mobile: '+1987654320',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const admin2: Admin = {
    id: generateId(),
    fullName: 'Sanjana Kasarla',
    email: 'sanjanakasarla25092006@gmail.com',
    mobile: '+1987654321',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjana',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  // Store core catalog structure
  instructors.forEach(instructor => localStorageService.addUser(instructor));
  localStorageService.addUser(admin);
  localStorageService.addUser(admin2);
  courses.forEach(course => localStorageService.addCourse(course));

  console.log('Core catalog data initialized successfully!');
};
