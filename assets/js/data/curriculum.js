/* ============================================
   SQLSENSEI — Curriculum Data
   Single source of truth for levels + modules
   ============================================ */

window.CURRICULUM = [
  {
    id: 'L1',
    number: 1,
    title: 'Foundations',
    tagline: 'The Building Blocks',
    color: '#22d3ee',
    badge: 'cyan',
    description: 'The bedrock. SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, NULL — the 20% of SQL that handles 80% of daily work.',
    modules: [
      { id: '1.1', title: 'What is a database?',        topic: 'Tables, rows, columns, data types' },
      { id: '1.2', title: 'Your first SELECT',          topic: 'Retrieving data from a table' },
      { id: '1.3', title: 'WHERE clause',               topic: 'Filtering rows by condition' },
      { id: '1.4', title: 'ORDER BY and LIMIT',         topic: 'Sorting and slicing results' },
      { id: '1.5', title: 'DISTINCT and NULL',          topic: 'Uniqueness and missing values' }
    ]
  },
  {
    id: 'L2',
    number: 2,
    title: 'Shaping Data',
    tagline: 'Making It Useful',
    color: '#fbbf24',
    badge: 'amber',
    description: 'Take raw rows and turn them into insight. Aggregates, grouping, string and date manipulation.',
    modules: [
      { id: '2.1', title: 'Aggregate functions',        topic: 'COUNT, SUM, AVG, MIN, MAX' },
      { id: '2.2', title: 'GROUP BY',                   topic: 'Grouping rows for summaries' },
      { id: '2.3', title: 'HAVING',                     topic: 'Filtering groups (not rows)' },
      { id: '2.4', title: 'Aliases',                    topic: 'AS for columns and tables' },
      { id: '2.5', title: 'String functions',           topic: 'UPPER, LOWER, CONCAT, SUBSTRING, LENGTH' },
      { id: '2.6', title: 'Date functions',             topic: 'NOW, DATE_PART, DATEDIFF, DATE_FORMAT' }
    ]
  },
  {
    id: 'L3',
    number: 3,
    title: 'Multi-Table SQL',
    tagline: 'Where Real Power Lives',
    color: '#34d399',
    badge: 'emerald',
    description: 'Joins, subqueries, and CTEs. The moment SQL stops feeling like spreadsheets and starts feeling like programming.',
    modules: [
      { id: '3.1', title: 'What is a JOIN?',            topic: 'Visual intuition with Venn diagrams' },
      { id: '3.2', title: 'INNER JOIN',                 topic: 'Matching rows only' },
      { id: '3.3', title: 'LEFT and RIGHT JOIN',        topic: 'Keeping all rows from one side' },
      { id: '3.4', title: 'FULL OUTER and CROSS JOIN',  topic: 'All rows, all combinations' },
      { id: '3.5', title: 'Self-joins',                 topic: 'Joining a table with itself' },
      { id: '3.6', title: 'Subqueries',                 topic: 'Queries inside queries' },
      { id: '3.7', title: 'CTEs',                       topic: 'WITH clause for readable multi-step logic' }
    ]
  },
  {
    id: 'L4',
    number: 4,
    title: 'Advanced SQL',
    tagline: 'Senior-Level Thinking',
    color: '#a78bfa',
    badge: 'violet',
    description: 'Window functions, conditional logic, set operations, indexes. The line between intermediate and senior SQL.',
    modules: [
      { id: '4.1', title: 'Window functions',           topic: 'ROW_NUMBER, RANK, DENSE_RANK' },
      { id: '4.2', title: 'Window frames',              topic: 'PARTITION BY, ORDER BY inside windows' },
      { id: '4.3', title: 'LAG and LEAD',               topic: 'Comparing rows across time' },
      { id: '4.4', title: 'CASE WHEN',                  topic: 'Conditional logic inside queries' },
      { id: '4.5', title: 'EXISTS and NOT EXISTS',      topic: 'Correlated existence checks' },
      { id: '4.6', title: 'UNION / INTERSECT / EXCEPT', topic: 'Combining result sets' },
      { id: '4.7', title: 'Indexes',                    topic: 'What, when, and why they speed things up' }
    ]
  },
  {
    id: 'L5',
    number: 5,
    title: 'Real-World SQL',
    tagline: 'Production Readiness',
    color: '#fb7185',
    badge: 'rose',
    description: 'Schema design, transactions, views, stored procedures, query optimization. Ship-ready SQL.',
    modules: [
      { id: '5.1', title: 'Database design',            topic: 'Normalization, 1NF/2NF/3NF, foreign keys' },
      { id: '5.2', title: 'Transactions',               topic: 'COMMIT, ROLLBACK, ACID properties' },
      { id: '5.3', title: 'Views & Materialized Views', topic: 'Saved queries and cached results' },
      { id: '5.4', title: 'Stored procedures',          topic: 'Functions and reusable logic' },
      { id: '5.5', title: 'Query optimization',         topic: 'EXPLAIN ANALYZE, identifying bottlenecks' },
      { id: '5.6', title: 'Capstone project',           topic: 'Build a full schema + 10 real queries' }
    ]
  }
];

/* ============================================
   Working dataset (shown in lessons + playground)
   ============================================ */

window.DATASET = {
  customers: {
    columns: [
      { name: 'customer_id', type: 'INT', pk: true },
      { name: 'name',        type: 'VARCHAR' },
      { name: 'email',       type: 'VARCHAR' },
      { name: 'city',        type: 'VARCHAR' },
      { name: 'signup_date', type: 'DATE' },
      { name: 'age',         type: 'INT' }
    ],
    rows: [
      [1, 'Aarav Mehta',  'aarav@mail.com',  'Mumbai',    '2024-01-12', 28],
      [2, 'Sofia Reyes',  'sofia@mail.com',  'Madrid',    '2024-02-04', 34],
      [3, 'Kenji Tanaka', 'kenji@mail.com',  'Tokyo',     '2024-02-19', 41],
      [4, 'Priya Singh',  'priya@mail.com',  'Delhi',     '2024-03-08', 26],
      [5, 'Liam Doyle',   'liam@mail.com',   'Dublin',    '2024-04-22', 52],
      [6, 'Chen Wei',     'chen@mail.com',   'Shanghai',  '2024-05-15', 31],
      [7, 'Amara Okafor', 'amara@mail.com',  'Lagos',     '2024-06-30', 29],
      [8, 'Noa Cohen',    'noa@mail.com',    'Tel Aviv',  '2024-08-11', 45]
    ]
  },
  products: {
    columns: [
      { name: 'product_id', type: 'INT', pk: true },
      { name: 'name',       type: 'VARCHAR' },
      { name: 'category',   type: 'VARCHAR' },
      { name: 'price',      type: 'DECIMAL' },
      { name: 'stock',      type: 'INT' }
    ],
    rows: [
      [101, 'Wireless Mouse',     'Electronics', 24.99,  120],
      [102, 'Mechanical Keyboard','Electronics', 89.50,  45],
      [103, 'Yoga Mat',           'Fitness',     29.00,  80],
      [104, 'Stainless Bottle',   'Kitchen',     18.75,  200],
      [105, 'Running Shoes',      'Fitness',     119.00, 35],
      [106, 'Desk Lamp',          'Home',        42.00,  60],
      [107, 'Notebook Set',       'Stationery',  12.50,  300],
      [108, 'Bluetooth Speaker',  'Electronics', 64.00,  0]
    ]
  },
  orders: {
    columns: [
      { name: 'order_id',     type: 'INT', pk: true },
      { name: 'customer_id',  type: 'INT', fk: 'customers.customer_id' },
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
      [1010, 1, '2024-08-04', 12.50,  'shipped']
    ]
  },
  order_items: {
    columns: [
      { name: 'item_id',    type: 'INT', pk: true },
      { name: 'order_id',   type: 'INT', fk: 'orders.order_id' },
      { name: 'product_id', type: 'INT', fk: 'products.product_id' },
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
      [10, 1008, 102, 1, 89.50],
      [11, 1008, 106, 1, 42.00],
      [12, 1009, 108, 1, 64.00],
      [13, 1010, 107, 1, 12.50]
    ]
  },
  employees: {
    columns: [
      { name: 'employee_id', type: 'INT', pk: true },
      { name: 'name',        type: 'VARCHAR' },
      { name: 'department',  type: 'VARCHAR' },
      { name: 'salary',      type: 'DECIMAL' },
      { name: 'manager_id',  type: 'INT', fk: 'employees.employee_id' },
      { name: 'hire_date',   type: 'DATE' }
    ],
    rows: [
      [1, 'Diana Park',     'Engineering', 145000, null, '2020-01-15'],
      [2, 'Marcus Lee',     'Engineering', 98000,  1,    '2021-03-22'],
      [3, 'Yuki Sato',      'Engineering', 102000, 1,    '2021-06-10'],
      [4, 'Elena Rossi',    'Sales',       125000, null, '2019-11-05'],
      [5, 'Tomas Novak',    'Sales',       75000,  4,    '2022-02-14'],
      [6, 'Aisha Khan',     'Sales',       82000,  4,    '2022-08-30'],
      [7, 'Hiroshi Mori',   'Design',      95000,  null, '2020-09-12'],
      [8, 'Carla Mendes',   'Design',      71000,  7,    '2023-01-20']
    ]
  }
};

/* ============================================
   Helpers
   ============================================ */

window.getAllModules = function() {
  const all = [];
  window.CURRICULUM.forEach(lvl => {
    lvl.modules.forEach(m => all.push({ ...m, levelNumber: lvl.number, levelColor: lvl.color, levelBadge: lvl.badge }));
  });
  return all;
};

window.getModuleById = function(id) {
  for (const lvl of window.CURRICULUM) {
    const m = lvl.modules.find(x => x.id === id);
    if (m) return { ...m, levelNumber: lvl.number, levelColor: lvl.color, levelBadge: lvl.badge };
  }
  return null;
};

window.getLevelByNumber = function(n) {
  return window.CURRICULUM.find(l => l.number === n);
};
