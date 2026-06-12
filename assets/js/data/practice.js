/* ============================================
   SQLSENSEI — Practice Dataset + Questions
   Extended schema with realistic real-world tables
   inspired by StrataScratch / LeetCode SQL problems.
   ============================================ */

window.PRACTICE_DATASET = {
  /* ============ Employees / Salaries (FAANG classics) ============ */
  ms_employee_salary: {
    columns: [
      { name: 'id',            type: 'INT' },
      { name: 'first_name',    type: 'VARCHAR' },
      { name: 'last_name',     type: 'VARCHAR' },
      { name: 'department_id', type: 'INT' },
      { name: 'salary',        type: 'INT' }
    ],
    rows: [
      // Multiple records per employee — some are outdated
      [1, 'Allen',   'Wang',    1, 85000],
      [1, 'Allen',   'Wang',    1, 92000],
      [2, 'Joyce',   'Edwards', 2, 78000],
      [2, 'Joyce',   'Edwards', 2, 81000],
      [3, 'Linda',   'Jones',   1, 105000],
      [4, 'Tom',     'Mendoza', 3, 67000],
      [4, 'Tom',     'Mendoza', 3, 71000],
      [4, 'Tom',     'Mendoza', 3, 74000],
      [5, 'Sara',    'Kim',     2, 95000],
      [6, 'Diego',   'Lopez',   1, 88000],
      [6, 'Diego',   'Lopez',   1, 88000],
      [7, 'Mei',     'Chen',    3, 73000],
      [8, 'Omar',    'Ali',     2, 102000],
      [8, 'Omar',    'Ali',     2, 110000]
    ]
  },

  employees: {
    columns: [
      { name: 'employee_id', type: 'INT', pk: true },
      { name: 'name',        type: 'VARCHAR' },
      { name: 'department',  type: 'VARCHAR' },
      { name: 'salary',      type: 'INT' },
      { name: 'manager_id',  type: 'INT' },
      { name: 'hire_date',   type: 'DATE' }
    ],
    rows: [
      [1, 'Diana Park',    'Engineering', 145000, null, '2020-01-15'],
      [2, 'Marcus Lee',    'Engineering', 98000,  1,    '2021-03-22'],
      [3, 'Yuki Sato',     'Engineering', 102000, 1,    '2021-06-10'],
      [4, 'Elena Rossi',   'Sales',       125000, null, '2019-11-05'],
      [5, 'Tomas Novak',   'Sales',       75000,  4,    '2022-02-14'],
      [6, 'Aisha Khan',    'Sales',       82000,  4,    '2022-08-30'],
      [7, 'Hiroshi Mori',  'Design',      95000,  null, '2020-09-12'],
      [8, 'Carla Mendes',  'Design',      71000,  7,    '2023-01-20'],
      [9, 'Raj Patel',     'Engineering', 88000,  1,    '2023-05-01'],
      [10,'Anna Schmidt',  'Sales',       91000,  4,    '2023-09-12']
    ]
  },

  /* ============ Customers / Orders / Products (e-commerce) ============ */
  customers: {
    columns: [
      { name: 'customer_id', type: 'INT', pk: true },
      { name: 'name',        type: 'VARCHAR' },
      { name: 'email',       type: 'VARCHAR' },
      { name: 'city',        type: 'VARCHAR' },
      { name: 'country',     type: 'VARCHAR' },
      { name: 'signup_date', type: 'DATE' }
    ],
    rows: [
      [1, 'Aarav Mehta',  'aarav@mail.com',  'Mumbai',   'India',  '2024-01-12'],
      [2, 'Sofia Reyes',  'sofia@mail.com',  'Madrid',   'Spain',  '2024-02-04'],
      [3, 'Kenji Tanaka', 'kenji@mail.com',  'Tokyo',    'Japan',  '2024-02-19'],
      [4, 'Priya Singh',  'priya@mail.com',  'Delhi',    'India',  '2024-03-08'],
      [5, 'Liam Doyle',   'liam@mail.com',   'Dublin',   'Ireland','2024-04-22'],
      [6, 'Chen Wei',     'chen@mail.com',   'Shanghai', 'China',  '2024-05-15'],
      [7, 'Amara Okafor', 'amara@mail.com',  'Lagos',    'Nigeria','2024-06-30'],
      [8, 'Noa Cohen',    'noa@mail.com',    'Tel Aviv', 'Israel', '2024-08-11']
    ]
  },

  products: {
    columns: [
      { name: 'product_id', type: 'INT', pk: true },
      { name: 'name',       type: 'VARCHAR' },
      { name: 'category',   type: 'VARCHAR' },
      { name: 'price',      type: 'DECIMAL' }
    ],
    rows: [
      [101, 'Wireless Mouse',      'Electronics', 24.99],
      [102, 'Mechanical Keyboard', 'Electronics', 89.50],
      [103, 'Yoga Mat',            'Fitness',     29.00],
      [104, 'Stainless Bottle',    'Kitchen',     18.75],
      [105, 'Running Shoes',       'Fitness',     119.00],
      [106, 'Desk Lamp',           'Home',        42.00],
      [107, 'Notebook Set',        'Stationery',  12.50],
      [108, 'Bluetooth Speaker',   'Electronics', 64.00]
    ]
  },

  orders: {
    columns: [
      { name: 'order_id',     type: 'INT', pk: true },
      { name: 'customer_id',  type: 'INT' },
      { name: 'order_date',   type: 'DATE' },
      { name: 'total_amount', type: 'DECIMAL' },
      { name: 'status',       type: 'VARCHAR' }
    ],
    rows: [
      [1001, 1, '2024-03-15', 114.49, 'delivered'],
      [1002, 2, '2024-03-22', 89.50,  'delivered'],
      [1003, 1, '2024-04-02', 42.00,  'delivered'],
      [1004, 3, '2024-04-18', 148.00, 'delivered'],
      [1005, 4, '2024-05-05', 24.99,  'shipped'],
      [1006, 5, '2024-05-20', 250.00, 'delivered'],
      [1007, 6, '2024-06-11', 18.75,  'cancelled'],
      [1008, 2, '2024-07-01', 131.50, 'delivered'],
      [1009, 7, '2024-07-19', 64.00,  'pending'],
      [1010, 1, '2024-08-04', 12.50,  'shipped'],
      [1011, 3, '2024-09-10', 89.50,  'delivered'],
      [1012, 5, '2024-10-12', 119.00, 'delivered'],
      [1013, 1, '2024-11-05', 42.00,  'delivered'],
      [1014, 8, '2024-11-22', 64.00,  'delivered']
    ]
  },

  order_items: {
    columns: [
      { name: 'item_id',    type: 'INT', pk: true },
      { name: 'order_id',   type: 'INT' },
      { name: 'product_id', type: 'INT' },
      { name: 'quantity',   type: 'INT' },
      { name: 'unit_price', type: 'DECIMAL' }
    ],
    rows: [
      [1, 1001, 102, 1, 89.50],
      [2, 1001, 104, 1, 18.75],
      [3, 1002, 102, 1, 89.50],
      [4, 1003, 106, 1, 42.00],
      [5, 1004, 105, 1, 119.00],
      [6, 1004, 103, 1, 29.00],
      [7, 1005, 101, 1, 24.99],
      [8, 1006, 105, 2, 119.00],
      [9, 1007, 104, 1, 18.75],
      [10,1008, 102, 1, 89.50],
      [11,1008, 106, 1, 42.00],
      [12,1009, 108, 1, 64.00],
      [13,1010, 107, 1, 12.50],
      [14,1011, 102, 1, 89.50],
      [15,1012, 105, 1, 119.00],
      [16,1013, 106, 1, 42.00],
      [17,1014, 108, 1, 64.00]
    ]
  },

  /* ============ FB-style: Users / Posts / Comments / Friends ============ */
  fb_users: {
    columns: [
      { name: 'user_id', type: 'INT', pk: true },
      { name: 'name',    type: 'VARCHAR' },
      { name: 'city',    type: 'VARCHAR' },
      { name: 'joined',  type: 'DATE' }
    ],
    rows: [
      [1, 'Alice',  'NYC',     '2023-01-15'],
      [2, 'Bob',    'NYC',     '2023-02-10'],
      [3, 'Carol',  'SF',      '2023-03-20'],
      [4, 'Dave',   'SF',      '2023-04-05'],
      [5, 'Eve',    'Austin',  '2023-05-22'],
      [6, 'Frank',  'NYC',     '2023-06-30'],
      [7, 'Grace',  'Seattle', '2023-08-12']
    ]
  },

  fb_posts: {
    columns: [
      { name: 'post_id',   type: 'INT', pk: true },
      { name: 'user_id',   type: 'INT' },
      { name: 'post_date', type: 'DATE' },
      { name: 'likes',     type: 'INT' }
    ],
    rows: [
      [1001, 1, '2024-01-05', 12],
      [1002, 1, '2024-01-12', 45],
      [1003, 2, '2024-01-20', 8],
      [1004, 3, '2024-02-02', 67],
      [1005, 3, '2024-02-15', 23],
      [1006, 4, '2024-03-10', 91],
      [1007, 5, '2024-03-22', 34],
      [1008, 1, '2024-04-05', 50],
      [1009, 6, '2024-04-18', 19],
      [1010, 2, '2024-05-01', 88]
    ]
  },

  fb_friends: {
    columns: [
      { name: 'user_id',   type: 'INT' },
      { name: 'friend_id', type: 'INT' }
    ],
    rows: [
      [1, 2], [1, 3], [1, 6],
      [2, 1], [2, 4],
      [3, 1], [3, 4], [3, 5],
      [4, 2], [4, 3], [4, 7],
      [5, 3],
      [6, 1],
      [7, 4]
    ]
  },

  /* ============ Sessions / Events (analytics) ============ */
  user_sessions: {
    columns: [
      { name: 'session_id', type: 'INT', pk: true },
      { name: 'user_id',    type: 'INT' },
      { name: 'session_ts', type: 'DATETIME' },
      { name: 'duration',   type: 'INT' }  // minutes
    ],
    rows: [
      [1, 101, '2024-09-01 09:15:00', 12],
      [2, 101, '2024-09-01 10:05:00', 8],
      [3, 102, '2024-09-01 14:22:00', 35],
      [4, 101, '2024-09-02 09:00:00', 22],
      [5, 103, '2024-09-02 11:40:00', 5],
      [6, 102, '2024-09-03 16:18:00', 18],
      [7, 101, '2024-09-03 17:00:00', 9],
      [8, 104, '2024-09-04 08:30:00', 41],
      [9, 102, '2024-09-04 19:25:00', 27],
      [10,103, '2024-09-05 12:10:00', 14]
    ]
  },

  /* ============ Logins (gaps & islands) ============ */
  daily_logins: {
    columns: [
      { name: 'user_id',    type: 'INT' },
      { name: 'login_date', type: 'DATE' }
    ],
    rows: [
      [1, '2024-09-01'], [1, '2024-09-02'], [1, '2024-09-03'],
      [1, '2024-09-05'], [1, '2024-09-06'],
      [2, '2024-09-01'], [2, '2024-09-04'],
      [2, '2024-09-05'], [2, '2024-09-06'], [2, '2024-09-07'],
      [3, '2024-09-02'], [3, '2024-09-03']
    ]
  },

  /* ============ Trips (Uber-style) ============ */
  trips: {
    columns: [
      { name: 'trip_id',     type: 'INT', pk: true },
      { name: 'rider_id',    type: 'INT' },
      { name: 'driver_id',   type: 'INT' },
      { name: 'status',      type: 'VARCHAR' },
      { name: 'request_date',type: 'DATE' },
      { name: 'fare',        type: 'DECIMAL' }
    ],
    rows: [
      [1, 1, 10, 'completed',  '2024-10-01', 24.50],
      [2, 1, 11, 'cancelled',  '2024-10-01', 0.00],
      [3, 2, 10, 'completed',  '2024-10-02', 18.75],
      [4, 3, 12, 'completed',  '2024-10-02', 32.00],
      [5, 2, 11, 'cancelled',  '2024-10-03', 0.00],
      [6, 4, 10, 'completed',  '2024-10-03', 45.20],
      [7, 1, 12, 'completed',  '2024-10-04', 22.30],
      [8, 5, 11, 'completed',  '2024-10-04', 16.00],
      [9, 2, 10, 'cancelled',  '2024-10-05', 0.00],
      [10,3, 12, 'completed',  '2024-10-05', 28.50]
    ]
  }
};


/* ============================================================
   PRACTICE QUESTIONS — 10 per topic, 8 topics = 80 problems
   Each is solvable with the dataset above.
   ============================================================ */

window.PRACTICE_TOPICS = [
  { id: 'basics',    label: 'SELECT & WHERE basics',    icon: '🟢', count: 10 },
  { id: 'agg',       label: 'Aggregation & GROUP BY',   icon: '📊', count: 10 },
  { id: 'joins',     label: 'JOINs',                    icon: '🔗', count: 10 },
  { id: 'subquery',  label: 'Subqueries & CTEs',        icon: '🪆', count: 10 },
  { id: 'window',    label: 'Window functions',         icon: '🪟', count: 10 },
  { id: 'datetime',  label: 'Date & time',              icon: '🕐', count: 10 },
  { id: 'string',    label: 'String manipulation',      icon: '📝', count: 10 },
  { id: 'advanced',  label: 'Advanced / FAANG',         icon: '🚀', count: 10 }
];

window.PRACTICE_QUESTIONS = {

  /* ==================== BASICS ==================== */
  basics: [
    {
      id: 'b1',
      title: 'All employees in Engineering',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['employees'],
      prompt: 'Return the <code>name</code> and <code>salary</code> of every employee in the <strong>Engineering</strong> department, sorted by salary descending.',
      solution: "SELECT name, salary FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;"
    },
    {
      id: 'b2',
      title: 'Customers from India',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Return all columns for customers from <strong>India</strong>.',
      solution: "SELECT * FROM customers WHERE country = 'India';"
    },
    {
      id: 'b3',
      title: 'Products under $30',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['products'],
      prompt: 'List the <code>name</code> and <code>price</code> of every product that costs <strong>less than $30</strong>, cheapest first.',
      solution: 'SELECT name, price FROM products WHERE price < 30 ORDER BY price ASC;'
    },
    {
      id: 'b4',
      title: 'Top 5 most expensive products',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['products'],
      prompt: 'Return the 5 most expensive products. Show <code>name</code> and <code>price</code>.',
      solution: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5;'
    },
    {
      id: 'b5',
      title: 'Distinct cities',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Return every <strong>unique city</strong> customers come from, sorted alphabetically.',
      solution: 'SELECT DISTINCT city FROM customers ORDER BY city ASC;'
    },
    {
      id: 'b6',
      title: 'Employees with no manager',
      company: 'Apple',
      difficulty: 'Easy',
      tables: ['employees'],
      prompt: 'Find every employee whose <code>manager_id</code> is NULL (the top-level managers). Return their <code>name</code> and <code>department</code>.',
      solution: 'SELECT name, department FROM employees WHERE manager_id IS NULL;'
    },
    {
      id: 'b7',
      title: 'Delivered orders over $100',
      company: 'Stripe',
      difficulty: 'Easy',
      tables: ['orders'],
      prompt: "Return <code>order_id</code>, <code>customer_id</code>, and <code>total_amount</code> for every order with status <strong>'delivered'</strong> and amount <strong>greater than $100</strong>.",
      solution: "SELECT order_id, customer_id, total_amount FROM orders WHERE status = 'delivered' AND total_amount > 100;"
    },
    {
      id: 'b8',
      title: 'Customers signed up in 2024',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Return <code>name</code> and <code>signup_date</code> for customers who signed up <strong>between Jan 1 and Jun 30, 2024</strong>.',
      solution: "SELECT name, signup_date FROM customers WHERE signup_date BETWEEN '2024-01-01' AND '2024-06-30';"
    },
    {
      id: 'b9',
      title: 'Posts with more than 30 likes',
      company: 'Meta',
      difficulty: 'Easy',
      tables: ['fb_posts'],
      prompt: 'Return <code>post_id</code>, <code>user_id</code>, and <code>likes</code> for every post that received <strong>more than 30 likes</strong>, most-liked first.',
      solution: 'SELECT post_id, user_id, likes FROM fb_posts WHERE likes > 30 ORDER BY likes DESC;'
    },
    {
      id: 'b10',
      title: 'Cancelled trips',
      company: 'Uber',
      difficulty: 'Easy',
      tables: ['trips'],
      prompt: 'Return <code>trip_id</code>, <code>rider_id</code>, and <code>request_date</code> for every cancelled trip.',
      solution: "SELECT trip_id, rider_id, request_date FROM trips WHERE status = 'cancelled';"
    }
  ],

  /* ==================== AGGREGATION ==================== */
  agg: [
    {
      id: 'a1',
      title: 'Count delivered orders',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['orders'],
      prompt: "How many orders have status <strong>'delivered'</strong>?",
      solution: "SELECT COUNT(*) FROM orders WHERE status = 'delivered';"
    },
    {
      id: 'a2',
      title: 'Average product price',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['products'],
      prompt: 'What is the <strong>average price</strong> across all products? Round to 2 decimals.',
      solution: 'SELECT ROUND(AVG(price), 2) AS avg_price FROM products;'
    },
    {
      id: 'a3',
      title: 'Revenue per customer',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'For each customer, return their <code>customer_id</code> and the <strong>total revenue</strong> (sum of total_amount) across all orders. Sort by revenue descending.',
      solution: 'SELECT customer_id, SUM(total_amount) AS revenue FROM orders GROUP BY customer_id ORDER BY revenue DESC;'
    },
    {
      id: 'a4',
      title: 'Products per category',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['products'],
      prompt: 'Count how many products exist in each <code>category</code>. Show category and the count.',
      solution: 'SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;'
    },
    {
      id: 'a5',
      title: 'Customers with more than 2 orders',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'Find every <code>customer_id</code> that has placed <strong>more than 2 orders</strong>. Show customer_id and the order count.',
      solution: 'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) > 2;'
    },
    {
      id: 'a6',
      title: 'Highest and lowest salary per department',
      company: 'Microsoft',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'For each department, show the <strong>max</strong> and <strong>min</strong> salary. Label them <code>max_salary</code> and <code>min_salary</code>.',
      solution: 'SELECT department, MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM employees GROUP BY department;'
    },
    {
      id: 'a7',
      title: 'Total likes per user',
      company: 'Meta',
      difficulty: 'Medium',
      tables: ['fb_posts'],
      prompt: 'For each <code>user_id</code> in fb_posts, return their total likes across all posts. Sort descending.',
      solution: 'SELECT user_id, SUM(likes) AS total_likes FROM fb_posts GROUP BY user_id ORDER BY total_likes DESC;'
    },
    {
      id: 'a8',
      title: 'Average session duration per user',
      company: 'Netflix',
      difficulty: 'Medium',
      tables: ['user_sessions'],
      prompt: 'For each <code>user_id</code> in user_sessions, return the <strong>average session duration</strong> rounded to 1 decimal.',
      solution: 'SELECT user_id, ROUND(AVG(duration), 1) AS avg_duration FROM user_sessions GROUP BY user_id;'
    },
    {
      id: 'a9',
      title: 'Departments with avg salary above $90k',
      company: 'Microsoft',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'Return departments where the <strong>average salary is above $90,000</strong>. Show department name and avg_salary.',
      solution: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 90000;'
    },
    {
      id: 'a10',
      title: 'Revenue per status',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'For each order <code>status</code>, return the count of orders and the total revenue (SUM of total_amount).',
      solution: 'SELECT status, COUNT(*) AS orders, SUM(total_amount) AS revenue FROM orders GROUP BY status;'
    }
  ],

  /* ==================== JOINS ==================== */
  joins: [
    {
      id: 'j1',
      title: 'Customers with their orders',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['customers', 'orders'],
      prompt: 'Return the customer <code>name</code> and the <code>order_id</code> for every order. Sort by order_id.',
      solution: 'SELECT c.name, o.order_id FROM customers c JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.order_id;'
    },
    {
      id: 'j2',
      title: 'Customers who never ordered',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['customers', 'orders'],
      prompt: 'Find customer names who have <strong>never placed an order</strong>.',
      solution: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;'
    },
    {
      id: 'j3',
      title: 'Total spent per customer name',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['customers', 'orders'],
      prompt: 'For each customer, return their <code>name</code> and their <strong>total spent</strong> across all orders. Sort by spent desc.',
      solution: 'SELECT c.name, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name ORDER BY total_spent DESC;'
    },
    {
      id: 'j4',
      title: 'Products that were ordered',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['products', 'order_items'],
      prompt: 'Return the <strong>distinct names</strong> of products that have appeared in at least one order.',
      solution: 'SELECT DISTINCT p.name FROM products p JOIN order_items oi ON p.product_id = oi.product_id;'
    },
    {
      id: 'j5',
      title: 'Products that were never ordered',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['products', 'order_items'],
      prompt: 'Find product names that have <strong>never appeared in any order</strong>.',
      solution: 'SELECT p.name FROM products p LEFT JOIN order_items oi ON p.product_id = oi.product_id WHERE oi.item_id IS NULL;'
    },
    {
      id: 'j6',
      title: 'Employee + manager name (self-join)',
      company: 'Apple',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'For each employee, return their <code>name</code> as <code>employee</code> and their manager\'s name as <code>manager</code>. Include employees with no manager (NULL).',
      solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.employee_id;'
    },
    {
      id: 'j7',
      title: 'Direct report count per manager',
      company: 'Microsoft',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'For each manager, return the manager\'s name and how many <strong>direct reports</strong> they have. Sort by report count desc.',
      solution: 'SELECT m.name AS manager, COUNT(e.employee_id) AS reports FROM employees m JOIN employees e ON e.manager_id = m.employee_id GROUP BY m.name ORDER BY reports DESC;'
    },
    {
      id: 'j8',
      title: 'Revenue per product category',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['products', 'order_items'],
      prompt: 'For each product <code>category</code>, return the total revenue (sum of <code>quantity * unit_price</code>). Sort by revenue desc.',
      solution: 'SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.category ORDER BY revenue DESC;'
    },
    {
      id: 'j9',
      title: 'Posts with author name',
      company: 'Meta',
      difficulty: 'Easy',
      tables: ['fb_users', 'fb_posts'],
      prompt: 'Return <code>post_id</code>, the user\'s <code>name</code>, and the post\'s <code>likes</code> for every post.',
      solution: 'SELECT p.post_id, u.name, p.likes FROM fb_posts p JOIN fb_users u ON p.user_id = u.user_id;'
    },
    {
      id: 'j10',
      title: 'Drivers and number of completed trips',
      company: 'Uber',
      difficulty: 'Medium',
      tables: ['trips'],
      prompt: "For each driver, return <code>driver_id</code> and the number of <strong>completed</strong> trips they have done. Sort by count desc.",
      solution: "SELECT driver_id, COUNT(*) AS completed_trips FROM trips WHERE status = 'completed' GROUP BY driver_id ORDER BY completed_trips DESC;"
    }
  ],

  /* ==================== SUBQUERY / CTE ==================== */
  subquery: [
    {
      id: 's1',
      title: 'Customers older... wait, above-avg spend',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'Find customer_ids whose <strong>total spend is above the average total spend</strong> across all customers.',
      solution: 'SELECT customer_id, SUM(total_amount) AS total FROM orders GROUP BY customer_id HAVING SUM(total_amount) > (SELECT AVG(total) FROM (SELECT SUM(total_amount) AS total FROM orders GROUP BY customer_id) sub);'
    },
    {
      id: 's2',
      title: 'Products priced above average',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['products'],
      prompt: 'Return products whose <code>price</code> is above the overall average product price. Show name and price.',
      solution: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);'
    },
    {
      id: 's3',
      title: 'Customers who placed an order',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['customers', 'orders'],
      prompt: 'Return customer names who have placed at least one order. Use <code>EXISTS</code>.',
      solution: 'SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);'
    },
    {
      id: 's4',
      title: 'Customers who never ordered (NOT EXISTS)',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['customers', 'orders'],
      prompt: 'Find customer names who have never placed an order. Use <code>NOT EXISTS</code> (NULL-safe).',
      solution: 'SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);'
    },
    {
      id: 's5',
      title: 'Most expensive product per category',
      company: 'Amazon',
      difficulty: 'Hard',
      tables: ['products'],
      prompt: 'For each category, return the most expensive product (name, category, price). Use a subquery.',
      solution: 'SELECT name, category, price FROM products p WHERE price = (SELECT MAX(price) FROM products WHERE category = p.category);'
    },
    {
      id: 's6',
      title: 'Employees earning more than dept avg',
      company: 'Microsoft',
      difficulty: 'Hard',
      tables: ['employees'],
      prompt: 'Find employees who earn <strong>more than the average salary in their department</strong>. Show name, department, salary.',
      solution: 'SELECT name, department, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);'
    },
    {
      id: 's7',
      title: 'Second highest product price',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['products'],
      prompt: 'Return the <strong>second-highest price</strong> from the products table as a single value.',
      solution: 'SELECT MAX(price) AS second_highest FROM products WHERE price < (SELECT MAX(price) FROM products);'
    },
    {
      id: 's8',
      title: 'CTE — top spenders',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['customers', 'orders'],
      prompt: 'Use a CTE to find customers whose total spend exceeds $100. Return customer name and their total.',
      solution: 'WITH spenders AS (SELECT customer_id, SUM(total_amount) AS total FROM orders GROUP BY customer_id HAVING SUM(total_amount) > 100) SELECT c.name, s.total FROM customers c JOIN spenders s ON c.customer_id = s.customer_id ORDER BY s.total DESC;'
    },
    {
      id: 's9',
      title: 'Recursive CTE — numbers 1 to 10',
      company: 'Generic',
      difficulty: 'Medium',
      tables: [],
      prompt: 'Use a recursive CTE to generate the numbers <strong>1 through 10</strong> in a single column called <code>n</code>.',
      solution: 'WITH RECURSIVE nums AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 10) SELECT * FROM nums;'
    },
    {
      id: 's10',
      title: 'Customers from cities with > 1 customer',
      company: 'Generic',
      difficulty: 'Medium',
      tables: ['customers'],
      prompt: 'Return customer names whose city has <strong>more than one customer</strong>. Use a subquery in WHERE.',
      solution: 'SELECT name FROM customers WHERE city IN (SELECT city FROM customers GROUP BY city HAVING COUNT(*) > 1);'
    }
  ],

  /* ==================== WINDOW ==================== */
  window: [
    {
      id: 'w1',
      title: 'Rank employees by salary in their department',
      company: 'Microsoft',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'Return name, department, salary, and a column <code>dept_rank</code> ranking employees by salary <strong>within their department</strong> (highest = rank 1). Use <code>DENSE_RANK</code>.',
      solution: 'SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;'
    },
    {
      id: 'w2',
      title: 'Top 2 highest-paid employees per department',
      company: 'Amazon',
      difficulty: 'Hard',
      tables: ['employees'],
      prompt: 'For each department, return the <strong>top 2 highest-paid</strong> employees (name, department, salary). Use a window function inside a CTE.',
      solution: 'WITH ranked AS (SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees) SELECT name, department, salary FROM ranked WHERE rnk <= 2 ORDER BY department, salary DESC;'
    },
    {
      id: 'w3',
      title: 'Running total of order revenue',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'For each order, return <code>order_id</code>, <code>order_date</code>, <code>total_amount</code>, and a <code>running_total</code> of revenue ordered chronologically.',
      solution: 'SELECT order_id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date) AS running_total FROM orders ORDER BY order_date;'
    },
    {
      id: 'w4',
      title: 'Each order vs the previous one (LAG)',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'Return order_id, order_date, total_amount, and a column <code>prev_amount</code> with the previous order\'s amount (ordered by date). First row will be NULL.',
      solution: 'SELECT order_id, order_date, total_amount, LAG(total_amount) OVER (ORDER BY order_date) AS prev_amount FROM orders ORDER BY order_date;'
    },
    {
      id: 'w5',
      title: 'Latest order per customer',
      company: 'Amazon',
      difficulty: 'Hard',
      tables: ['orders'],
      prompt: 'Return the <strong>most recent order</strong> per customer (all columns from orders). Use ROW_NUMBER inside a CTE.',
      solution: 'WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn FROM orders) SELECT order_id, customer_id, order_date, total_amount, status FROM ranked WHERE rn = 1;'
    },
    {
      id: 'w6',
      title: 'Each order\'s percentage of total revenue',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'For each order, return order_id, total_amount, and <code>pct_of_total</code> — what percentage of total revenue this order represents. Round to 2 decimals.',
      solution: 'SELECT order_id, total_amount, ROUND(100.0 * total_amount / SUM(total_amount) OVER (), 2) AS pct_of_total FROM orders;'
    },
    {
      id: 'w7',
      title: 'Rank posts by likes per user',
      company: 'Meta',
      difficulty: 'Medium',
      tables: ['fb_posts'],
      prompt: 'For each user, rank their posts by likes (most-liked = 1). Show post_id, user_id, likes, and rank as <code>post_rank</code>.',
      solution: 'SELECT post_id, user_id, likes, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY likes DESC) AS post_rank FROM fb_posts;'
    },
    {
      id: 'w8',
      title: 'Cumulative likes per user over time',
      company: 'Meta',
      difficulty: 'Hard',
      tables: ['fb_posts'],
      prompt: 'For each post, return user_id, post_date, likes, and a <code>cumulative_likes</code> running total per user ordered by date.',
      solution: 'SELECT user_id, post_date, likes, SUM(likes) OVER (PARTITION BY user_id ORDER BY post_date) AS cumulative_likes FROM fb_posts ORDER BY user_id, post_date;'
    },
    {
      id: 'w9',
      title: 'Difference between consecutive sessions',
      company: 'Netflix',
      difficulty: 'Hard',
      tables: ['user_sessions'],
      prompt: 'For each session, return session_id, user_id, duration, and a column <code>delta</code> = duration - previous session\'s duration for the same user.',
      solution: 'SELECT session_id, user_id, duration, duration - LAG(duration) OVER (PARTITION BY user_id ORDER BY session_ts) AS delta FROM user_sessions ORDER BY user_id, session_ts;'
    },
    {
      id: 'w10',
      title: 'NTILE quartiles by salary',
      company: 'Goldman Sachs',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'Divide employees into 4 salary quartiles. Return name, salary, and <code>quartile</code> (1 = lowest 25%, 4 = highest 25%).',
      solution: 'SELECT name, salary, NTILE(4) OVER (ORDER BY salary) AS quartile FROM employees;'
    }
  ],

  /* ==================== DATE / TIME ==================== */
  datetime: [
    {
      id: 'd1',
      title: 'Orders placed in 2024',
      company: 'Stripe',
      difficulty: 'Easy',
      tables: ['orders'],
      prompt: "Return orders where <code>order_date</code> is in year 2024. Show order_id and order_date.",
      solution: "SELECT order_id, order_date FROM orders WHERE strftime('%Y', order_date) = '2024';"
    },
    {
      id: 'd2',
      title: 'Customers who signed up in Q1 2024',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Return customers who signed up between <strong>January 1 and March 31, 2024</strong>.',
      solution: "SELECT name, signup_date FROM customers WHERE signup_date BETWEEN '2024-01-01' AND '2024-03-31';"
    },
    {
      id: 'd3',
      title: 'Orders per month',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'Return the number of orders in each month. Show <code>month</code> (as YYYY-MM string) and count, sorted by month.',
      solution: "SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders FROM orders GROUP BY month ORDER BY month;"
    },
    {
      id: 'd4',
      title: 'Revenue per month',
      company: 'Stripe',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'For each month, return the total revenue. Show <code>month</code> (YYYY-MM) and <code>revenue</code>.',
      solution: "SELECT strftime('%Y-%m', order_date) AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month ORDER BY month;"
    },
    {
      id: 'd5',
      title: 'Signups per month',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Count how many customers signed up in each month. Show month (YYYY-MM) and signup count.',
      solution: "SELECT strftime('%Y-%m', signup_date) AS month, COUNT(*) AS signups FROM customers GROUP BY month ORDER BY month;"
    },
    {
      id: 'd6',
      title: 'Sessions per day of week',
      company: 'Netflix',
      difficulty: 'Medium',
      tables: ['user_sessions'],
      prompt: "Return the count of sessions per day of week (0=Sunday, 6=Saturday). Show <code>dow</code> and <code>session_count</code>.",
      solution: "SELECT strftime('%w', session_ts) AS dow, COUNT(*) AS session_count FROM user_sessions GROUP BY dow ORDER BY dow;"
    },
    {
      id: 'd7',
      title: 'Days since signup',
      company: 'Generic',
      difficulty: 'Medium',
      tables: ['customers'],
      prompt: "For each customer, show name, signup_date, and <code>days_since</code> = days from signup to <strong>2024-12-31</strong>. Use julianday.",
      solution: "SELECT name, signup_date, julianday('2024-12-31') - julianday(signup_date) AS days_since FROM customers ORDER BY days_since DESC;"
    },
    {
      id: 'd8',
      title: 'First and last order date per customer',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['orders'],
      prompt: 'For each customer, return customer_id, <code>first_order</code>, and <code>last_order</code> dates.',
      solution: 'SELECT customer_id, MIN(order_date) AS first_order, MAX(order_date) AS last_order FROM orders GROUP BY customer_id;'
    },
    {
      id: 'd9',
      title: 'Posts in March 2024',
      company: 'Meta',
      difficulty: 'Easy',
      tables: ['fb_posts'],
      prompt: 'Return all posts (all columns) from March 2024.',
      solution: "SELECT * FROM fb_posts WHERE strftime('%Y-%m', post_date) = '2024-03';"
    },
    {
      id: 'd10',
      title: 'Trips per day',
      company: 'Uber',
      difficulty: 'Medium',
      tables: ['trips'],
      prompt: "For each <code>request_date</code>, return the date, total trips, completed trips, and cancellation rate as a percent (rounded to 2 decimals).",
      solution: "SELECT request_date, COUNT(*) AS total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed, ROUND(100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 2) AS cancel_pct FROM trips GROUP BY request_date ORDER BY request_date;"
    }
  ],

  /* ==================== STRING ==================== */
  string: [
    {
      id: 'str1',
      title: 'Uppercase customer names',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Return each customer\'s name in UPPERCASE, aliased as <code>shouty_name</code>.',
      solution: 'SELECT UPPER(name) AS shouty_name FROM customers;'
    },
    {
      id: 'str2',
      title: 'Email domain',
      company: 'Meta',
      difficulty: 'Medium',
      tables: ['customers'],
      prompt: "For each customer, extract the email domain (everything after <code>@</code>). Show name and <code>domain</code>.",
      solution: "SELECT name, SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM customers;"
    },
    {
      id: 'str3',
      title: 'Length of each customer name',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'Return name and the character length of each customer name, aliased as <code>n</code>.',
      solution: 'SELECT name, LENGTH(name) AS n FROM customers;'
    },
    {
      id: 'str4',
      title: 'Customer + city label',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: "For each customer, return a column <code>label</code> formatted as <code>NAME (CITY)</code> — for example <code>Aarav Mehta (Mumbai)</code>.",
      solution: "SELECT name || ' (' || city || ')' AS label FROM customers;"
    },
    {
      id: 'str5',
      title: 'Products containing \'wireless\'',
      company: 'Amazon',
      difficulty: 'Easy',
      tables: ['products'],
      prompt: "Find products whose name contains the word <strong>'Wireless'</strong> (case-sensitive is fine). Return name and price.",
      solution: "SELECT name, price FROM products WHERE name LIKE '%Wireless%';"
    },
    {
      id: 'str6',
      title: 'Customers with \'@mail.com\' emails',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: "Return name and email for customers whose email ends with <code>@mail.com</code>.",
      solution: "SELECT name, email FROM customers WHERE email LIKE '%@mail.com';"
    },
    {
      id: 'str7',
      title: 'Replace \'Mumbai\' with \'BOM\'',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: "Return name and a column <code>city_code</code> where every occurrence of <code>'Mumbai'</code> is replaced with <code>'BOM'</code>.",
      solution: "SELECT name, REPLACE(city, 'Mumbai', 'BOM') AS city_code FROM customers;"
    },
    {
      id: 'str8',
      title: 'First 3 letters of each city',
      company: 'Generic',
      difficulty: 'Easy',
      tables: ['customers'],
      prompt: 'For each customer, return name and the <strong>first 3 letters</strong> of their city as <code>city_prefix</code>.',
      solution: 'SELECT name, SUBSTR(city, 1, 3) AS city_prefix FROM customers;'
    },
    {
      id: 'str9',
      title: 'Count customers per email domain',
      company: 'Meta',
      difficulty: 'Medium',
      tables: ['customers'],
      prompt: "Extract the email domain (after <code>@</code>) and count how many customers use each domain. Show domain and customer count.",
      solution: "SELECT SUBSTR(email, INSTR(email, '@') + 1) AS domain, COUNT(*) AS n FROM customers GROUP BY domain;"
    },
    {
      id: 'str10',
      title: 'Concatenate first and last name',
      company: 'Microsoft',
      difficulty: 'Easy',
      tables: ['ms_employee_salary'],
      prompt: "For each row in ms_employee_salary, return <code>full_name</code> = first_name + ' ' + last_name, along with salary.",
      solution: "SELECT first_name || ' ' || last_name AS full_name, salary FROM ms_employee_salary;"
    }
  ],

  /* ==================== ADVANCED / FAANG ==================== */
  advanced: [
    {
      id: 'adv1',
      title: 'Finding updated records (Microsoft)',
      company: 'Microsoft',
      difficulty: 'Medium',
      tables: ['ms_employee_salary'],
      prompt: "Some salary records are outdated. Assume salary is non-decreasing over time, so the <strong>current salary is the MAX</strong> per employee. Return id, first_name, last_name, department_id, and the current salary. Order by id ascending.",
      solution: 'SELECT id, first_name, last_name, department_id, MAX(salary) AS salary FROM ms_employee_salary GROUP BY id, first_name, last_name, department_id ORDER BY id;'
    },
    {
      id: 'adv2',
      title: 'Second highest salary (LeetCode #176)',
      company: 'Amazon',
      difficulty: 'Medium',
      tables: ['employees'],
      prompt: 'Return the <strong>second-highest salary</strong> from the employees table as a single column called <code>second_highest</code>. If no such salary, return NULL.',
      solution: 'SELECT MAX(salary) AS second_highest FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);'
    },
    {
      id: 'adv3',
      title: 'Department top 3 (LeetCode #185)',
      company: 'Meta',
      difficulty: 'Hard',
      tables: ['employees'],
      prompt: 'Return employees who earn one of the <strong>top 3 unique salaries</strong> in their department. Show department, name, salary, ordered by department, salary desc.',
      solution: 'WITH ranked AS (SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees) SELECT department, name, salary FROM ranked WHERE rnk <= 3 ORDER BY department, salary DESC;'
    },
    {
      id: 'adv4',
      title: 'Uber: cancellation rate per day',
      company: 'Uber',
      difficulty: 'Hard',
      tables: ['trips'],
      prompt: 'For each request_date, calculate the <strong>cancellation rate</strong> as the fraction of cancelled trips (rounded to 2 decimals). Show date and cancellation_rate.',
      solution: "SELECT request_date, ROUND(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 2) AS cancellation_rate FROM trips GROUP BY request_date ORDER BY request_date;"
    },
    {
      id: 'adv5',
      title: 'Meta: most active user',
      company: 'Meta',
      difficulty: 'Medium',
      tables: ['fb_posts'],
      prompt: 'Find the user who has posted the <strong>most posts</strong>. Return user_id and post_count. If tied, any one is fine.',
      solution: 'SELECT user_id, COUNT(*) AS post_count FROM fb_posts GROUP BY user_id ORDER BY post_count DESC LIMIT 1;'
    },
    {
      id: 'adv6',
      title: 'Netflix: longest session per user',
      company: 'Netflix',
      difficulty: 'Medium',
      tables: ['user_sessions'],
      prompt: 'For each user, return user_id and their <strong>longest session duration</strong> as <code>max_duration</code>.',
      solution: 'SELECT user_id, MAX(duration) AS max_duration FROM user_sessions GROUP BY user_id;'
    },
    {
      id: 'adv7',
      title: 'Login streak: longest consecutive days',
      company: 'Meta',
      difficulty: 'Hard',
      tables: ['daily_logins'],
      prompt: "For each user, find the <strong>longest streak of consecutive daily logins</strong>. Return user_id and <code>longest_streak</code>. (Gaps and islands pattern.)",
      solution: "WITH grp AS (SELECT user_id, login_date, julianday(login_date) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS streak_id FROM daily_logins) SELECT user_id, MAX(streak_length) AS longest_streak FROM (SELECT user_id, streak_id, COUNT(*) AS streak_length FROM grp GROUP BY user_id, streak_id) sub GROUP BY user_id;"
    },
    {
      id: 'adv8',
      title: 'Amazon: best-seller per category',
      company: 'Amazon',
      difficulty: 'Hard',
      tables: ['products', 'order_items'],
      prompt: "For each category, return the product that has the <strong>highest total quantity sold</strong>. Show category, name, and total_qty.",
      solution: "WITH ranked AS (SELECT p.category, p.name, SUM(oi.quantity) AS total_qty, RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rnk FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.category, p.name) SELECT category, name, total_qty FROM ranked WHERE rnk = 1 ORDER BY category;"
    },
    {
      id: 'adv9',
      title: 'Stripe: month-over-month growth %',
      company: 'Stripe',
      difficulty: 'Hard',
      tables: ['orders'],
      prompt: 'For each month, return the month, revenue, previous month\'s revenue, and growth percent (rounded to 2 decimals). Use LAG.',
      solution: "WITH monthly AS (SELECT strftime('%Y-%m', order_date) AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month) SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev_rev, ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 2) AS growth_pct FROM monthly ORDER BY month;"
    },
    {
      id: 'adv10',
      title: 'Meta: mutual friends count',
      company: 'Meta',
      difficulty: 'Hard',
      tables: ['fb_friends'],
      prompt: 'For user_id = 1, return the user_id of each of their friends and how many mutual friends user 1 shares with them. Show friend_id and mutual_count, sorted desc.',
      solution: 'SELECT f.friend_id, COUNT(*) AS mutual_count FROM fb_friends f JOIN fb_friends my ON f.friend_id = my.user_id AND my.friend_id IN (SELECT friend_id FROM fb_friends WHERE user_id = 1) WHERE f.user_id = 1 GROUP BY f.friend_id ORDER BY mutual_count DESC;'
    }
  ]
};
