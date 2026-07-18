import { Assignment, Question } from '@/types';

export const assignmentTopics = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms for efficient problem-solving and coding interviews.',
    difficulty: 'intermediate',
    estimatedTime: 120, // minutes
    mcqQuestions: [
      {
        id: 'dsa-mcq-1',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 'O(log n)',
        explanation: 'Binary search divides the search space in half each time, resulting in logarithmic time complexity.',
      },
      {
        id: 'dsa-mcq-2',
        question: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        correctAnswer: 'Stack',
        explanation: 'Stack follows LIFO principle where the last element inserted is the first one to be removed.',
      },
      {
        id: 'dsa-mcq-3',
        question: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 'O(n²)',
        explanation: 'Quicksort has worst-case O(n²) when the pivot selection is poor, but average case is O(n log n).',
      },
      {
        id: 'dsa-mcq-4',
        question: 'Which traversal method visits root, left subtree, then right subtree?',
        options: ['Inorder', 'Preorder', 'Postorder', 'Level order'],
        correctAnswer: 'Preorder',
        explanation: 'Preorder traversal visits root first, then left subtree, then right subtree.',
      },
      {
        id: 'dsa-mcq-5',
        question: 'What is the space complexity of merge sort?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 'O(n)',
        explanation: 'Merge sort requires O(n) auxiliary space for merging operations.',
      },
    ],
    codingQuestions: [
      {
        id: 'dsa-code-1',
        question: 'Implement a function to reverse a linked list.',
        starterCode: `function reverseLinkedList(head) {
  // Your code here
}`,
        solution: `function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`,
        timeLimit: 15,
        marks: 20,
      },
      {
        id: 'dsa-code-2',
        question: 'Implement binary search on a sorted array.',
        starterCode: `function binarySearch(arr, target) {
  // Your code here
}`,
        solution: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
        timeLimit: 10,
        marks: 15,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    description: 'Learn the fundamentals of machine learning including supervised and unsupervised learning algorithms.',
    difficulty: 'intermediate',
    estimatedTime: 150,
    mcqQuestions: [
      {
        id: 'ml-mcq-1',
        question: 'Which algorithm is used for classification?',
        options: ['Linear Regression', 'Logistic Regression', 'K-Means', 'PCA'],
        correctAnswer: 'Logistic Regression',
        explanation: 'Logistic Regression is used for binary classification problems.',
      },
      {
        id: 'ml-mcq-2',
        question: 'What is overfitting in machine learning?',
        options: ['Model performs well on training data only', 'Model performs well on test data only', 'Model has too few parameters', 'Model is too simple'],
        correctAnswer: 'Model performs well on training data only',
        explanation: 'Overfitting occurs when a model learns the training data too well and fails to generalize.',
      },
      {
        id: 'ml-mcq-3',
        question: 'Which technique is used to prevent overfitting?',
        options: ['Increasing model complexity', 'Regularization', 'Using more features', 'Reducing training data'],
        correctAnswer: 'Regularization',
        explanation: 'Regularization techniques like L1 and L2 help prevent overfitting adding penalty terms.',
      },
      {
        id: 'ml-mcq-4',
        question: 'What is the purpose of cross-validation?',
        options: ['To increase training speed', 'To evaluate model performance', 'To reduce model size', 'To increase model accuracy'],
        correctAnswer: 'To evaluate model performance',
        explanation: 'Cross-validation helps assess how well the model generalizes to unseen data.',
      },
      {
        id: 'ml-mcq-5',
        question: 'Which metric is used for regression problems?',
        options: ['Accuracy', 'F1 Score', 'Mean Squared Error', 'Precision'],
        correctAnswer: 'Mean Squared Error',
        explanation: 'MSE is commonly used to evaluate regression models by measuring average squared differences.',
      },
    ],
    codingQuestions: [
      {
        id: 'ml-code-1',
        question: 'Implement a simple linear regression model from scratch.',
        starterCode: `class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
  }
  
  fit(X, y) {
    // Your code here
  }
  
  predict(X) {
    // Your code here
  }
}`,
        solution: `class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
  }
  
  fit(X, y) {
    const n = X.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += X[i];
      sumY += y[i];
      sumXY += X[i] * y[i];
      sumX2 += X[i] * X[i];
    }
    
    this.slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
  }
  
  predict(X) {
    return X.map(x => this.slope * x + this.intercept);
  }
}`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    description: 'Explore neural networks, deep learning architectures, and their applications in AI.',
    difficulty: 'advanced',
    estimatedTime: 180,
    mcqQuestions: [
      {
        id: 'dl-mcq-1',
        question: 'What is the activation function commonly used in hidden layers?',
        options: ['Sigmoid', 'ReLU', 'Softmax', 'Linear'],
        correctAnswer: 'ReLU',
        explanation: 'ReLU is widely used in hidden layers due to its computational efficiency and ability to mitigate vanishing gradient.',
      },
      {
        id: 'dl-mcq-2',
        question: 'What is backpropagation used for?',
        options: ['Forward propagation', 'Training neural networks', 'Data preprocessing', 'Feature selection'],
        correctAnswer: 'Training neural networks',
        explanation: 'Backpropagation computes gradients of the loss function with respect to network weights.',
      },
      {
        id: 'dl-mcq-3',
        question: 'Which architecture is used for image classification?',
        options: ['RNN', 'CNN', 'Transformer', 'LSTM'],
        correctAnswer: 'CNN',
        explanation: 'Convolutional Neural Networks are designed for image processing and classification tasks.',
      },
      {
        id: 'dl-mcq-4',
        question: 'What is the vanishing gradient problem?',
        options: ['Gradients become too small during training', 'Gradients become too large during training', 'Model overfits', 'Model underfits'],
        correctAnswer: 'Gradients become too small during training',
        explanation: 'Vanishing gradients occur in deep networks when gradients approach zero, preventing learning.',
      },
      {
        id: 'dl-mcq-5',
        question: 'Which optimizer uses momentum?',
        options: ['SGD', 'Adam', 'RMSprop', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'Adam, RMSprop, and SGD with momentum all use momentum to accelerate convergence.',
      },
    ],
    codingQuestions: [
      {
        id: 'dl-code-1',
        question: 'Implement a simple neural network with one hidden layer.',
        starterCode: `class NeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize) {
    // Initialize weights
  }
  
  forward(X) {
    // Implement forward pass
  }
  
  backward(X, y, learningRate) {
    // Implement backpropagation
  }
}`,
        solution: `class NeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize) {
    this.W1 = Math.random() * 2 - 1; // Simplified initialization
    this.W2 = Math.random() * 2 - 1;
    this.b1 = 0;
    this.b2 = 0;
  }
  
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  forward(X) {
    this.hidden = this.sigmoid(X * this.W1 + this.b1);
    this.output = this.sigmoid(this.hidden * this.W2 + this.b2);
    return this.output;
  }
  
  backward(X, y, learningRate) {
    const error = y - this.output;
    const dOutput = error * this.output * (1 - this.output);
    const dHidden = dOutput * this.W2 * this.hidden * (1 - this.hidden);
    
    this.W2 += learningRate * dOutput * this.hidden;
    this.b2 += learningRate * dOutput;
    this.W1 += learningRate * dHidden * X;
    this.b1 += learningRate * dHidden;
  }
}`,
        timeLimit: 25,
        marks: 30,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Comprehensive introduction to AI concepts, search algorithms, and intelligent systems.',
    difficulty: 'intermediate',
    estimatedTime: 120,
    mcqQuestions: [
      {
        id: 'ai-mcq-1',
        question: 'What is the goal of AI?',
        options: ['To replace humans', 'To create intelligent machines', 'To process data faster', 'To store information'],
        correctAnswer: 'To create intelligent machines',
        explanation: 'AI aims to create systems that can perform tasks requiring human intelligence.',
      },
      {
        id: 'ai-mcq-2',
        question: 'Which search algorithm is complete and optimal?',
        options: ['Depth-First Search', 'Breadth-First Search', 'Greedy Best-First', 'Hill Climbing'],
        correctAnswer: 'Breadth-First Search',
        explanation: 'BFS is complete and optimal for unweighted graphs as it explores all nodes level by level.',
      },
      {
        id: 'ai-mcq-3',
        question: 'What is a heuristic function?',
        options: ['A random guess', 'An estimate of distance to goal', 'A sorting algorithm', 'A data structure'],
        correctAnswer: 'An estimate of distance to goal',
        explanation: 'Heuristics provide estimated costs to guide search algorithms toward the goal.',
      },
      {
        id: 'ai-mcq-4',
        question: 'Which AI technique uses knowledge representation?',
        options: ['Machine Learning', 'Expert Systems', 'Neural Networks', 'Genetic Algorithms'],
        correctAnswer: 'Expert Systems',
        explanation: 'Expert systems use knowledge bases and inference engines to solve domain-specific problems.',
      },
      {
        id: 'ai-mcq-5',
        question: 'What is the Turing Test used for?',
        options: ['Testing AI hardware', 'Testing machine intelligence', 'Testing database performance', 'Testing network speed'],
        correctAnswer: 'Testing machine intelligence',
        explanation: 'The Turing Test evaluates a machine\'s ability to exhibit intelligent behavior indistinguishable from humans.',
      },
    ],
    codingQuestions: [
      {
        id: 'ai-code-1',
        question: 'Implement A* search algorithm for pathfinding.',
        starterCode: `function aStar(start, goal, heuristic) {
  // Your code here
}`,
        solution: `function aStar(start, goal, heuristic) {
  const openSet = [start];
  const cameFrom = {};
  const gScore = { [start]: 0 };
  const fScore = { [start]: heuristic(start, goal) };
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => (fScore[a] || Infinity) - (fScore[b] || Infinity));
    const current = openSet.shift();
    
    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }
    
    for (const neighbor of getNeighbors(current)) {
      const tentativeGScore = (gScore[current] || Infinity) + distance(current, neighbor);
      
      if (tentativeGScore < (gScore[neighbor] || Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = tentativeGScore + heuristic(neighbor, goal);
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  
  return null; // No path found
}`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'python',
    name: 'Python Programming',
    description: 'Master Python programming from basics to advanced concepts including OOP and data structures.',
    difficulty: 'beginner',
    estimatedTime: 90,
    mcqQuestions: [
      {
        id: 'python-mcq-1',
        question: 'What is the correct way to create a list in Python?',
        options: ['list = []', 'list = ()', 'list = {}', 'list = <>'],
        correctAnswer: 'list = []',
        explanation: 'Lists in Python are created using square brackets [].',
      },
      {
        id: 'python-mcq-2',
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 'def',
        explanation: 'The def keyword is used to define functions in Python.',
      },
      {
        id: 'python-mcq-3',
        question: 'What is the output of print(type(3.14))?',
        options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'number\'>'],
        correctAnswer: '<class \'float\'>',
        explanation: '3.14 is a floating-point number, so its type is float.',
      },
      {
        id: 'python-mcq-4',
        question: 'Which method is used to add an element to a list?',
        options: ['add()', 'append()', 'insert()', 'push()'],
        correctAnswer: 'append()',
        explanation: 'The append() method adds an element to the end of a list.',
      },
      {
        id: 'python-mcq-5',
        question: 'What does the len() function do?',
        options: ['Calculates length', 'Calculates logarithm', 'Calculates limit', 'Calculates loop'],
        correctAnswer: 'Calculates length',
        explanation: 'len() returns the number of items in a container.',
      },
    ],
    codingQuestions: [
      {
        id: 'python-code-1',
        question: 'Write a function to check if a number is prime.',
        starterCode: `def is_prime(n):
  # Your code here`,
        solution: `def is_prime(n):
  if n < 2:
    return False
  for i in range(2, int(n**0.5) + 1):
    if n % i == 0:
      return False
  return True`,
        timeLimit: 10,
        marks: 15,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'java',
    name: 'Java Programming',
    description: 'Learn Java programming fundamentals including OOP, collections, and exception handling.',
    difficulty: 'intermediate',
    estimatedTime: 120,
    mcqQuestions: [
      {
        id: 'java-mcq-1',
        question: 'Which keyword is used to create a class in Java?',
        options: ['class', 'Class', 'create', 'new'],
        correctAnswer: 'class',
        explanation: 'The class keyword is used to define a class in Java.',
      },
      {
        id: 'java-mcq-2',
        question: 'What is the entry point of a Java program?',
        options: ['start()', 'main()', 'init()', 'run()'],
        correctAnswer: 'main()',
        explanation: 'The main() method is the entry point where program execution begins.',
      },
      {
        id: 'java-mcq-3',
        question: 'Which collection does not allow duplicate elements?',
        options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'],
        correctAnswer: 'HashSet',
        explanation: 'HashSet implements Set interface which doesn\'t allow duplicate elements.',
      },
      {
        id: 'java-mcq-4',
        question: 'What is polymorphism in Java?',
        options: ['Multiple inheritance', 'Same name different behavior', 'Data hiding', 'Code reuse'],
        correctAnswer: 'Same name different behavior',
        explanation: 'Polymorphism allows objects of different classes to be treated as objects of a common superclass.',
      },
      {
        id: 'java-mcq-5',
        question: 'Which keyword is used for inheritance?',
        options: ['inherits', 'extends', 'implements', 'super'],
        correctAnswer: 'extends',
        explanation: 'The extends keyword is used for class inheritance in Java.',
      },
    ],
    codingQuestions: [
      {
        id: 'java-code-1',
        question: 'Implement a generic Stack class in Java.',
        starterCode: `public class Stack<T> {
  // Your code here
}`,
        solution: `public class Stack<T> {
  private List<T> items = new ArrayList<>();
  
  public void push(T item) {
    items.add(item);
  }
  
  public T pop() {
    if (isEmpty()) {
      throw new EmptyStackException();
    }
    return items.remove(items.size() - 1);
  }
  
  public T peek() {
    if (isEmpty()) {
      throw new EmptyStackException();
    }
    return items.get(items.size() - 1);
  }
  
  public boolean isEmpty() {
    return items.isEmpty();
  }
  
  public int size() {
    return items.size();
  }
}`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'web-dev',
    name: 'Web Development (HTML/CSS/JavaScript)',
    description: 'Build modern web applications using HTML5, CSS3, and JavaScript ES6+.',
    difficulty: 'beginner',
    estimatedTime: 100,
    mcqQuestions: [
      {
        id: 'web-mcq-1',
        question: 'Which HTML tag is used for the largest heading?',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        correctAnswer: '<h1>',
        explanation: '<h1> is the largest heading tag in HTML.',
      },
      {
        id: 'web-mcq-2',
        question: 'What CSS property is used to change text color?',
        options: ['text-color', 'color', 'font-color', 'foreground'],
        correctAnswer: 'color',
        explanation: 'The color property sets the foreground color of text content.',
      },
      {
        id: 'web-mcq-3',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 'push()',
        explanation: 'push() adds one or more elements to the end of an array.',
      },
      {
        id: 'web-mcq-4',
        question: 'What does DOM stand for?',
        options: ['Document Object Model', 'Data Object Model', 'Digital Object Model', 'Document Order Model'],
        correctAnswer: 'Document Object Model',
        explanation: 'DOM represents the HTML document as a tree structure that can be manipulated with JavaScript.',
      },
      {
        id: 'web-mcq-5',
        question: 'Which CSS selector has the highest specificity?',
        options: ['Class selector', 'ID selector', 'Element selector', 'Universal selector'],
        correctAnswer: 'ID selector',
        explanation: 'ID selectors have higher specificity than class and element selectors.',
      },
    ],
    codingQuestions: [
      {
        id: 'web-code-1',
        question: 'Create a responsive navigation bar using HTML, CSS, and JavaScript.',
        starterCode: `// HTML and CSS structure
// Your code here`,
        solution: `// HTML
<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <button class="menu-toggle">☰</button>
</nav>

// CSS
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #333;
}

.nav-links {
  display: flex;
  list-style: none;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}

// JavaScript
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});`,
        timeLimit: 25,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'react',
    name: 'React.js',
    description: 'Build interactive UIs with React including hooks, state management, and component architecture.',
    difficulty: 'intermediate',
    estimatedTime: 130,
    mcqQuestions: [
      {
        id: 'react-mcq-1',
        question: 'What hook is used for state management in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useState',
        explanation: 'useState is the primary hook for managing state in functional components.',
      },
      {
        id: 'react-mcq-2',
        question: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extension', 'JavaScript Extended'],
        correctAnswer: 'JavaScript XML',
        explanation: 'JSX is a syntax extension that allows writing HTML-like code in JavaScript.',
      },
      {
        id: 'react-mcq-3',
        question: 'Which hook is used for side effects?',
        options: ['useState', 'useEffect', 'useContext', 'useMemo'],
        correctAnswer: 'useEffect',
        explanation: 'useEffect is used to handle side effects like data fetching and subscriptions.',
      },
      {
        id: 'react-mcq-4',
        question: 'What is the purpose of keys in React lists?',
        options: ['To style elements', 'To identify elements', 'To sort elements', 'To delete elements'],
        correctAnswer: 'To identify elements',
        explanation: 'Keys help React identify which items have changed, added, or removed.',
      },
      {
        id: 'react-mcq-5',
        question: 'Which method is used to update state based on previous state?',
        options: ['setState(newState)', 'setState(prev => prev)', 'setState(prevState)', 'Both B and C'],
        correctAnswer: 'Both B and C',
        explanation: 'Both functional updates and using previous state are valid patterns.',
      },
    ],
    codingQuestions: [
      {
        id: 'react-code-1',
        question: 'Create a custom hook for fetching data.',
        starterCode: `function useFetch(url) {
  // Your code here
}`,
        solution: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Build full-stack applications with Next.js including SSR, SSG, and API routes.',
    difficulty: 'advanced',
    estimatedTime: 150,
    mcqQuestions: [
      {
        id: 'nextjs-mcq-1',
        question: 'What does SSR stand for in Next.js?',
        options: ['Server Side Rendering', 'Simple State Rendering', 'Single Source Repository', 'Secure Socket Routing'],
        correctAnswer: 'Server Side Rendering',
        explanation: 'SSR generates HTML on the server for each request.',
      },
      {
        id: 'nextjs-mcq-2',
        question: 'Which function is used for static generation?',
        options: ['getServerSideProps', 'getStaticProps', 'getInitialProps', 'getServerProps'],
        correctAnswer: 'getStaticProps',
        explanation: 'getStaticProps is used for static site generation at build time.',
      },
      {
        id: 'nextjs-mcq-3',
        question: 'What is the purpose of API routes in Next.js?',
        options: ['To create backend endpoints', 'To style components', 'To manage state', 'To handle routing'],
        correctAnswer: 'To create backend endpoints',
        explanation: 'API routes allow building API endpoints as part of your Next.js application.',
      },
      {
        id: 'nextjs-mcq-4',
        question: 'Which file creates dynamic routes?',
        options: ['[id].js', 'id.js', '_id.js', '@id.js'],
        correctAnswer: '[id].js',
        explanation: 'Square brackets in file names create dynamic route segments.',
      },
      {
        id: 'nextjs-mcq-5',
        question: 'What is Image Optimization in Next.js?',
        options: ['Manual image resizing', 'Automatic image optimization', 'Image compression only', 'Image hosting service'],
        correctAnswer: 'Automatic image optimization',
        explanation: 'Next.js automatically optimizes images by resizing, compressing, and serving in modern formats.',
      },
    ],
    codingQuestions: [
      {
        id: 'nextjs-code-1',
        question: 'Create an API route for user authentication.',
        starterCode: `// pages/api/auth/login.js
export default function handler(req, res) {
  // Your code here
}`,
        solution: `// pages/api/auth/login.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }
  
  // Authenticate user (simplified)
  const user = authenticateUser(email, password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create session token
  const token = createToken(user);
  
  return res.status(200).json({ 
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email }
  });
}`,
        timeLimit: 25,
        marks: 30,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    description: 'Build backend services with Node.js and Express including REST APIs and middleware.',
    difficulty: 'intermediate',
    estimatedTime: 120,
    mcqQuestions: [
      {
        id: 'nodejs-mcq-1',
        question: 'What is npm?',
        options: ['Node Package Manager', 'New Project Manager', 'Network Protocol Manager', 'Node Process Monitor'],
        correctAnswer: 'Node Package Manager',
        explanation: 'npm is the package manager for Node.js JavaScript runtime.',
      },
      {
        id: 'nodejs-mcq-2',
        question: 'Which method is used to start a server in Express?',
        options: ['start()', 'listen()', 'run()', 'serve()'],
        correctAnswer: 'listen()',
        explanation: 'app.listen() starts the Express server and binds it to a port.',
      },
      {
        id: 'nodejs-mcq-3',
        question: 'What is middleware in Express?',
        options: ['Database connector', 'Functions that process requests', 'UI components', 'Testing framework'],
        correctAnswer: 'Functions that process requests',
        explanation: 'Middleware functions have access to request and response objects.',
      },
      {
        id: 'nodejs-mcq-4',
        question: 'Which HTTP method is used to update data?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 'PUT',
        explanation: 'PUT is used to update existing resources on the server.',
      },
      {
        id: 'nodejs-mcq-5',
        question: 'What is the event loop in Node.js?',
        options: ['A loop for UI events', 'A mechanism for async operations', 'A database connection pool', 'A routing mechanism'],
        correctAnswer: 'A mechanism for async operations',
        explanation: 'The event loop enables asynchronous, non-blocking I/O operations in Node.js.',
      },
    ],
    codingQuestions: [
      {
        id: 'nodejs-code-1',
        question: 'Create a REST API with Express for CRUD operations.',
        starterCode: `const express = require('express');
const app = express();

app.use(express.json());

// Your CRUD routes here

app.listen(3000);`,
        solution: `const express = require('express');
const app = express();

app.use(express.json());

// In-memory data store
let items = [];

// CREATE
app.post('/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  items.push(item);
  res.status(201).json(item);
});

// READ
app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// UPDATE
app.put('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// DELETE
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  items.splice(index, 1);
  res.json({ message: 'Deleted' });
});

app.listen(3000);`,
        timeLimit: 30,
        marks: 30,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'database',
    name: 'Database Management (SQL & NoSQL)',
    description: 'Learn database design, SQL queries, and NoSQL document databases.',
    difficulty: 'intermediate',
    estimatedTime: 130,
    mcqQuestions: [
      {
        id: 'db-mcq-1',
        question: 'Which SQL clause is used to filter results?',
        options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
        correctAnswer: 'WHERE',
        explanation: 'WHERE clause filters records based on specified conditions.',
      },
      {
        id: 'db-mcq-2',
        question: 'What is a primary key?',
        options: ['A foreign key reference', 'A unique identifier for each record', 'An index', 'A constraint'],
        correctAnswer: 'A unique identifier for each record',
        explanation: 'Primary key uniquely identifies each record in a table.',
      },
      {
        id: 'db-mcq-3',
        question: 'Which NoSQL database uses JSON-like documents?',
        options: ['Redis', 'Cassandra', 'MongoDB', 'Neo4j'],
        correctAnswer: 'MongoDB',
        explanation: 'MongoDB stores data in flexible, JSON-like documents.',
      },
      {
        id: 'db-mcq-4',
        question: 'What is normalization?',
        options: ['Data encryption', 'Organizing data to reduce redundancy', 'Data compression', 'Data indexing'],
        correctAnswer: 'Organizing data to reduce redundancy',
        explanation: 'Normalization organizes data to minimize redundancy and dependency.',
      },
      {
        id: 'db-mcq-5',
        question: 'Which JOIN returns all records from left table and matching from right?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'],
        correctAnswer: 'LEFT JOIN',
        explanation: 'LEFT JOIN returns all records from left table and matched records from right table.',
      },
    ],
    codingQuestions: [
      {
        id: 'db-code-1',
        question: 'Write complex SQL queries for data analysis.',
        starterCode: `-- Write a query to find top 3 categories by total sales
SELECT 
  -- Your code here`,
        solution: `-- Write a query to find top 3 categories by total sales
SELECT 
  c.category_name,
  SUM(oi.quantity * oi.unit_price) as total_sales,
  COUNT(DISTINCT o.order_id) as order_count
FROM categories c
JOIN products p ON c.category_id = p.category_id
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY c.category_id, c.category_name
ORDER BY total_sales DESC
LIMIT 3;`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'cloud',
    name: 'Cloud Computing (AWS/Azure)',
    description: 'Master cloud services deployment, scaling, and management on AWS and Azure platforms.',
    difficulty: 'advanced',
    estimatedTime: 140,
    mcqQuestions: [
      {
        id: 'cloud-mcq-1',
        question: 'What is EC2 in AWS?',
        options: ['Elastic Compute Cloud', 'Elastic Container Cloud', 'Elastic Content Cloud', 'Elastic Cache Cloud'],
        correctAnswer: 'Elastic Compute Cloud',
        explanation: 'EC2 provides scalable computing capacity in the AWS cloud.',
      },
      {
        id: 'cloud-mcq-2',
        question: 'Which AWS service is used for object storage?',
        options: ['EC2', 'S3', 'RDS', 'Lambda'],
        correctAnswer: 'S3',
        explanation: 'S3 (Simple Storage Service) is an object storage service.',
      },
      {
        id: 'cloud-mcq-3',
        question: 'What is serverless computing?',
        options: ['Running servers without OS', 'Cloud provider manages infrastructure', 'No servers at all', 'Manual server management'],
        correctAnswer: 'Cloud provider manages infrastructure',
        explanation: 'Serverless computing abstracts server management from developers.',
      },
      {
        id: 'cloud-mcq-4',
        question: 'Which Azure service is equivalent to AWS Lambda?',
        options: ['Azure Functions', 'Azure App Service', 'Azure VM', 'Azure Storage'],
        correctAnswer: 'Azure Functions',
        explanation: 'Azure Functions is the serverless compute service equivalent to AWS Lambda.',
      },
      {
        id: 'cloud-mcq-5',
        question: 'What is a VPC?',
        options: ['Virtual Private Cloud', 'Virtual Public Cloud', 'Very Private Computer', 'Virtual Process Container'],
        correctAnswer: 'Virtual Private Cloud',
        explanation: 'VPC provides isolated network resources in the cloud.',
      },
    ],
    codingQuestions: [
      {
        id: 'cloud-code-1',
        question: 'Create a Terraform configuration for AWS infrastructure.',
        starterCode: `# main.tf
provider "aws" {
  region = "us-east-1"
}

# Your infrastructure code here`,
        solution: `# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  
  tags = {
    Name = "public-subnet"
  }
}

resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow web traffic"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
  
  security_groups = [aws_security_group.web.name]
  
  tags = {
    Name = "web-server"
  }
}`,
        timeLimit: 30,
        marks: 30,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'security',
    name: 'Cyber Security',
    description: 'Learn cybersecurity fundamentals including network security, encryption, and threat analysis.',
    difficulty: 'advanced',
    estimatedTime: 160,
    mcqQuestions: [
      {
        id: 'security-mcq-1',
        question: 'What is the purpose of encryption?',
        options: ['To compress data', 'To protect data confidentiality', 'To speed up data transfer', 'To format data'],
        correctAnswer: 'To protect data confidentiality',
        explanation: 'Encryption protects data by converting it into unreadable format without proper keys.',
      },
      {
        id: 'security-mcq-2',
        question: 'What is a firewall?',
        options: ['Antivirus software', 'Network security system', 'Data backup tool', 'Password manager'],
        correctAnswer: 'Network security system',
        explanation: 'Firewall monitors and controls incoming and outgoing network traffic.',
      },
      {
        id: 'security-mcq-3',
        question: 'What is phishing?',
        options: ['Network scanning', 'Social engineering attack', 'Password cracking', 'DDoS attack'],
        correctAnswer: 'Social engineering attack',
        explanation: 'Phishing tricks users into revealing sensitive information through fake communications.',
      },
      {
        id: 'security-mcq-4',
        question: 'What is the difference between symmetric and asymmetric encryption?',
        options: ['Speed only', 'Key usage', 'Algorithm type', 'Data size'],
        correctAnswer: 'Key usage',
        explanation: 'Symmetric uses same key for encryption/decryption, asymmetric uses different keys.',
      },
      {
        id: 'security-mcq-5',
        question: 'What is a VPN?',
        options: ['Virtual Private Network', 'Very Private Network', 'Virtual Protocol Network', 'Visual Processing Network'],
        correctAnswer: 'Virtual Private Network',
        explanation: 'VPN creates secure, encrypted connections over public networks.',
      },
    ],
    codingQuestions: [
      {
        id: 'security-code-1',
        question: 'Implement a simple encryption/decryption function.',
        starterCode: `function encrypt(text, key) {
  // Your code here
}

function decrypt(ciphertext, key) {
  // Your code here
}`,
        solution: `function encrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function decrypt(ciphertext, key) {
  // XOR encryption is symmetric
  return encrypt(ciphertext, key);
}

// Usage
const message = 'Secret Message';
const key = 'mySecretKey';
const encrypted = encrypt(message, key);
const decrypted = decrypt(encrypted, key);`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'devops',
    name: 'DevOps & Docker/Kubernetes',
    description: 'Master DevOps practices including CI/CD, containerization, and orchestration.',
    difficulty: 'advanced',
    estimatedTime: 150,
    mcqQuestions: [
      {
        id: 'devops-mcq-1',
        question: 'What is Docker?',
        options: ['Virtual machine', 'Containerization platform', 'Programming language', 'Database'],
        correctAnswer: 'Containerization platform',
        explanation: 'Docker enables containerization of applications for consistent deployment.',
      },
      {
        id: 'devops-mcq-2',
        question: 'What is Kubernetes?',
        options: ['Container registry', 'Container orchestration platform', 'CI/CD tool', 'Monitoring tool'],
        correctAnswer: 'Container orchestration platform',
        explanation: 'Kubernetes automates deployment, scaling, and management of containerized applications.',
      },
      {
        id: 'devops-mcq-3',
        question: 'What is CI/CD?',
        options: ['Code Integration/Code Deployment', 'Continuous Integration/Continuous Deployment', 'Computer Interface/Computer Design', 'Cloud Integration/Cloud Deployment'],
        correctAnswer: 'Continuous Integration/Continuous Deployment',
        explanation: 'CI/CD automates the integration and deployment of code changes.',
      },
      {
        id: 'devops-mcq-4',
        question: 'What is a Dockerfile?',
        options: ['Docker configuration file', 'Docker image file', 'Docker container file', 'Docker network file'],
        correctAnswer: 'Docker configuration file',
        explanation: 'Dockerfile contains instructions to build a Docker image.',
      },
      {
        id: 'devops-mcq-5',
        question: 'What is a Pod in Kubernetes?',
        options: ['A container', 'A group of containers', 'A node', 'A cluster'],
        correctAnswer: 'A group of containers',
        explanation: 'Pod is the smallest deployable unit in Kubernetes, containing one or more containers.',
      },
    ],
    codingQuestions: [
      {
        id: 'devops-code-1',
        question: 'Create a Dockerfile for a Node.js application.',
        starterCode: `# Your Dockerfile here`,
        solution: `# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]

# Multi-stage build for production
# FROM node:18-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM node:18-alpine
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./
# RUN npm install --production
# EXPOSE 3000
# CMD ["node", "dist/main.js"]`,
        timeLimit: 20,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
  {
    id: 'data-science',
    name: 'Data Science & Analytics',
    description: 'Learn data analysis, visualization, and statistical methods for data-driven decision making.',
    difficulty: 'intermediate',
    estimatedTime: 140,
    mcqQuestions: [
      {
        id: 'ds-mcq-1',
        question: 'What is the purpose of data visualization?',
        options: ['To store data', 'To represent data graphically', 'To encrypt data', 'To compress data'],
        correctAnswer: 'To represent data graphically',
        explanation: 'Data visualization helps understand patterns and trends through graphical representation.',
      },
      {
        id: 'ds-mcq-2',
        question: 'What is a histogram used for?',
        options: ['Showing relationships', 'Showing distribution', 'Showing trends', 'Showing comparisons'],
        correctAnswer: 'Showing distribution',
        explanation: 'Histograms show the distribution of a continuous variable.',
      },
      {
        id: 'ds-mcq-3',
        question: 'What is the difference between mean and median?',
        options: ['No difference', 'Mean is average, median is middle value', 'Mean is middle, median is average', 'Both are the same'],
        correctAnswer: 'Mean is average, median is middle value',
        explanation: 'Mean is the arithmetic average, median is the middle value when sorted.',
      },
      {
        id: 'ds-mcq-4',
        question: 'What is correlation?',
        options: ['Causation', 'Statistical relationship between variables', 'Data storage', 'Data encryption'],
        correctAnswer: 'Statistical relationship between variables',
        explanation: 'Correlation measures the strength and direction of relationship between variables.',
      },
      {
        id: 'ds-mcq-5',
        question: 'What is standard deviation?',
        options: ['Average value', 'Measure of data spread', 'Maximum value', 'Minimum value'],
        correctAnswer: 'Measure of data spread',
        explanation: 'Standard deviation measures how spread out the data is from the mean.',
      },
    ],
    codingQuestions: [
      {
        id: 'ds-code-1',
        question: 'Implement data analysis functions for statistical calculations.',
        starterCode: `function calculateMean(data) {
  // Your code here
}

function calculateMedian(data) {
  // Your code here
}

function calculateStandardDeviation(data) {
  // Your code here
}`,
        solution: `function calculateMean(data) {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

function calculateMedian(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStandardDeviation(data) {
  const mean = calculateMean(data);
  const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = calculateMean(squaredDifferences);
  return Math.sqrt(avgSquaredDiff);
}

// Usage
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('Mean:', calculateMean(data));
console.log('Median:', calculateMedian(data));
console.log('Std Dev:', calculateStandardDeviation(data));`,
        timeLimit: 25,
        marks: 25,
      },
    ],
    totalMarks: 100,
  },
];

export const getAssignmentById = (id: string) => {
  return assignmentTopics.find(topic => topic.id === id);
};

export const getAssignmentsByDifficulty = (difficulty: string) => {
  return assignmentTopics.filter(topic => topic.difficulty === difficulty);
};
