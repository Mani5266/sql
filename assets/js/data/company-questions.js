/* ============================================
   SQLSENSEI — Company × Topic Practice Bank
   150+ real SQL interview questions from top tech
   companies, all runnable against PRACTICE_DATASET.
   ============================================ */

window.COMPANIES_LIST = [
  { id: 'all',       name: 'All Companies', emoji: '🌐', color: '#22d3ee' },
  { id: 'google',    name: 'Google',        emoji: '🔵', color: '#4285f4' },
  { id: 'amazon',    name: 'Amazon',        emoji: '📦', color: '#ff9900' },
  { id: 'meta',      name: 'Meta',          emoji: '👤', color: '#0668e1' },
  { id: 'netflix',   name: 'Netflix',       emoji: '🎬', color: '#e50914' },
  { id: 'apple',     name: 'Apple',         emoji: '🍎', color: '#a2aaad' },
  { id: 'microsoft', name: 'Microsoft',     emoji: '🪟', color: '#00a4ef' },
  { id: 'uber',      name: 'Uber',          emoji: '🚗', color: '#000000' },
  { id: 'airbnb',    name: 'Airbnb',        emoji: '🏡', color: '#ff5a5f' },
  { id: 'stripe',    name: 'Stripe',        emoji: '💳', color: '#635bff' },
  { id: 'linkedin',  name: 'LinkedIn',      emoji: '💼', color: '#0a66c2' }
];

window.TOPICS_LIST = [
  { id: 'all',      label: 'All Topics' },
  { id: 'basics',   label: 'Basics (SELECT, WHERE)' },
  { id: 'agg',      label: 'Aggregation & GROUP BY' },
  { id: 'joins',    label: 'JOINs' },
  { id: 'subquery', label: 'Subqueries & CTEs' },
  { id: 'window',   label: 'Window Functions' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'string',   label: 'String Manipulation' },
  { id: 'advanced', label: 'Advanced / Patterns' }
];

window.COMPANY_QUESTIONS = [

  /* ============================================
     GOOGLE — 15 questions
     ============================================ */
  {
    id: 'g1', company: 'google', topic: 'window', difficulty: 'Medium',
    title: 'Rank employees by salary in their department',
    tables: ['employees'],
    prompt: 'Asked frequently in Google data science loops. For each employee, return name, department, salary, and their <strong>rank within their department</strong> (highest = 1). Use DENSE_RANK to handle ties.',
    solution: 'SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;'
  },
  {
    id: 'g2', company: 'google', topic: 'window', difficulty: 'Hard',
    title: 'Top 3 highest-paid employees per department',
    tables: ['employees'],
    prompt: 'Classic Google interview question. Return the <strong>top 3 highest-paid employees in each department</strong>. Show name, department, salary, sorted by department then salary desc.',
    solution: 'WITH ranked AS (SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees) SELECT name, department, salary FROM ranked WHERE rnk <= 3 ORDER BY department, salary DESC;'
  },
  {
    id: 'g3', company: 'google', topic: 'window', difficulty: 'Hard',
    title: 'Running total of revenue',
    tables: ['orders'],
    prompt: 'For each order, show order_id, order_date, total_amount, and a <strong>cumulative running total</strong> of revenue ordered by date.',
    solution: 'SELECT order_id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date) AS running_total FROM orders ORDER BY order_date;'
  },
  {
    id: 'g4', company: 'google', topic: 'advanced', difficulty: 'Hard',
    title: 'Median product price',
    tables: ['products'],
    prompt: 'SQLite has no MEDIAN function. Compute the <strong>median price</strong> from products using window functions. Return one column called <code>median</code>.',
    solution: 'WITH ranked AS (SELECT price, ROW_NUMBER() OVER (ORDER BY price) AS rn, COUNT(*) OVER () AS cnt FROM products) SELECT AVG(price) AS median FROM ranked WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2);'
  },
  {
    id: 'g5', company: 'google', topic: 'subquery', difficulty: 'Medium',
    title: 'Products above average price',
    tables: ['products'],
    prompt: 'Return products whose price is <strong>strictly above the average product price</strong>. Show name and price.',
    solution: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);'
  },
  {
    id: 'g6', company: 'google', topic: 'window', difficulty: 'Medium',
    title: 'Each order vs previous (LAG)',
    tables: ['orders'],
    prompt: 'For each order ordered by date, return order_id, total_amount, and the <strong>previous order\'s amount</strong> (prev_amount). Use LAG.',
    solution: 'SELECT order_id, total_amount, LAG(total_amount) OVER (ORDER BY order_date) AS prev_amount FROM orders ORDER BY order_date;'
  },
  {
    id: 'g7', company: 'google', topic: 'advanced', difficulty: 'Hard',
    title: 'Login streak (gaps & islands)',
    tables: ['daily_logins'],
    prompt: 'Famous Google interview problem. For each user in daily_logins, find their <strong>longest consecutive-day login streak</strong>. Return user_id and longest_streak.',
    solution: 'WITH grp AS (SELECT user_id, login_date, julianday(login_date) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS streak_id FROM daily_logins) SELECT user_id, MAX(streak_length) AS longest_streak FROM (SELECT user_id, streak_id, COUNT(*) AS streak_length FROM grp GROUP BY user_id, streak_id) sub GROUP BY user_id;'
  },
  {
    id: 'g8', company: 'google', topic: 'agg', difficulty: 'Medium',
    title: 'Revenue per category',
    tables: ['products', 'order_items'],
    prompt: 'For each product <code>category</code>, compute total revenue (quantity × unit_price). Sort by revenue desc.',
    solution: 'SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.category ORDER BY revenue DESC;'
  },
  {
    id: 'g9', company: 'google', topic: 'window', difficulty: 'Medium',
    title: 'NTILE — salary quartiles',
    tables: ['employees'],
    prompt: 'Divide employees into 4 salary quartiles. Return name, salary, and <code>quartile</code> (1 = lowest 25%, 4 = highest 25%).',
    solution: 'SELECT name, salary, NTILE(4) OVER (ORDER BY salary) AS quartile FROM employees;'
  },
  {
    id: 'g10', company: 'google', topic: 'advanced', difficulty: 'Hard',
    title: 'Cumulative likes per user',
    tables: ['fb_posts'],
    prompt: 'For each post, return user_id, post_date, likes, and a <code>cumulative_likes</code> running total of likes per user (ordered by date).',
    solution: 'SELECT user_id, post_date, likes, SUM(likes) OVER (PARTITION BY user_id ORDER BY post_date) AS cumulative_likes FROM fb_posts ORDER BY user_id, post_date;'
  },
  {
    id: 'g11', company: 'google', topic: 'string', difficulty: 'Medium',
    title: 'Count users per email domain',
    tables: ['customers'],
    prompt: 'Extract the email domain (after <code>@</code>) and count customers per domain. Sort by count desc.',
    solution: "SELECT SUBSTR(email, INSTR(email, '@') + 1) AS domain, COUNT(*) AS n FROM customers GROUP BY domain ORDER BY n DESC;"
  },
  {
    id: 'g12', company: 'google', topic: 'agg', difficulty: 'Medium',
    title: 'Customers with multiple orders',
    tables: ['orders'],
    prompt: 'Find customer_ids who placed <strong>more than 2 orders</strong>. Return customer_id and order count.',
    solution: 'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) > 2;'
  },
  {
    id: 'g13', company: 'google', topic: 'subquery', difficulty: 'Medium',
    title: 'Second highest salary',
    tables: ['employees'],
    prompt: 'Return the <strong>second-highest distinct salary</strong> from employees as a single column called <code>second_highest</code>.',
    solution: 'SELECT MAX(salary) AS second_highest FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);'
  },
  {
    id: 'g14', company: 'google', topic: 'subquery', difficulty: 'Hard',
    title: 'Employees above department average',
    tables: ['employees'],
    prompt: 'Find employees who earn <strong>more than the average salary in their department</strong> (correlated subquery). Return name, department, salary.',
    solution: 'SELECT name, department, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);'
  },
  {
    id: 'g15', company: 'google', topic: 'datetime', difficulty: 'Medium',
    title: 'Sessions by day-of-week',
    tables: ['user_sessions'],
    prompt: "Count sessions per day of week. Show <code>dow</code> (0=Sun, 6=Sat) and <code>session_count</code>.",
    solution: "SELECT strftime('%w', session_ts) AS dow, COUNT(*) AS session_count FROM user_sessions GROUP BY dow ORDER BY dow;"
  },

  /* ============================================
     AMAZON — 18 questions (business metrics heavy)
     ============================================ */
  {
    id: 'am1', company: 'amazon', topic: 'agg', difficulty: 'Easy',
    title: 'Count delivered orders',
    tables: ['orders'],
    prompt: "How many orders have status <strong>'delivered'</strong>?",
    solution: "SELECT COUNT(*) FROM orders WHERE status = 'delivered';"
  },
  {
    id: 'am2', company: 'amazon', topic: 'agg', difficulty: 'Medium',
    title: 'Top 5 customers by lifetime value',
    tables: ['customers', 'orders'],
    prompt: 'Find the <strong>top 5 customers by lifetime value</strong> (sum of delivered order totals). Show name, city, and LTV.',
    solution: "SELECT c.name, c.city, SUM(o.total_amount) AS ltv FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'delivered' GROUP BY c.name, c.city ORDER BY ltv DESC LIMIT 5;"
  },
  {
    id: 'am3', company: 'amazon', topic: 'advanced', difficulty: 'Hard',
    title: 'Best-selling product per category',
    tables: ['products', 'order_items'],
    prompt: 'For each category, return the <strong>best-selling product</strong> by total quantity sold. Show category, name, total_qty.',
    solution: "WITH ranked AS (SELECT p.category, p.name, SUM(oi.quantity) AS total_qty, RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rnk FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.category, p.name) SELECT category, name, total_qty FROM ranked WHERE rnk = 1 ORDER BY category;"
  },
  {
    id: 'am4', company: 'amazon', topic: 'joins', difficulty: 'Easy',
    title: 'Customers who have ordered',
    tables: ['customers', 'orders'],
    prompt: 'Return distinct customer names who have placed at least one order.',
    solution: 'SELECT DISTINCT c.name FROM customers c JOIN orders o ON c.customer_id = o.customer_id;'
  },
  {
    id: 'am5', company: 'amazon', topic: 'joins', difficulty: 'Medium',
    title: 'Customers who never ordered',
    tables: ['customers', 'orders'],
    prompt: 'Find customer names who have <strong>never placed an order</strong>. Use LEFT JOIN.',
    solution: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;'
  },
  {
    id: 'am6', company: 'amazon', topic: 'advanced', difficulty: 'Medium',
    title: 'Products never ordered',
    tables: ['products', 'order_items'],
    prompt: 'Find product names that have <strong>never appeared in any order</strong>. Use NOT EXISTS.',
    solution: 'SELECT name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id);'
  },
  {
    id: 'am7', company: 'amazon', topic: 'window', difficulty: 'Hard',
    title: 'Latest order per customer',
    tables: ['orders'],
    prompt: 'Return the <strong>most recent order per customer</strong> (all columns from orders). Use ROW_NUMBER inside a CTE.',
    solution: 'WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn FROM orders) SELECT order_id, customer_id, order_date, total_amount, status FROM ranked WHERE rn = 1;'
  },
  {
    id: 'am8', company: 'amazon', topic: 'agg', difficulty: 'Medium',
    title: 'Revenue per status',
    tables: ['orders'],
    prompt: 'For each <code>status</code>, return the order count and total revenue.',
    solution: 'SELECT status, COUNT(*) AS orders, SUM(total_amount) AS revenue FROM orders GROUP BY status;'
  },
  {
    id: 'am9', company: 'amazon', topic: 'window', difficulty: 'Medium',
    title: 'Rank products by price in category',
    tables: ['products'],
    prompt: 'For each product, return category, name, price, and price_rank within its category (most expensive = 1).',
    solution: 'SELECT category, name, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank FROM products;'
  },
  {
    id: 'am10', company: 'amazon', topic: 'datetime', difficulty: 'Medium',
    title: 'Orders per month',
    tables: ['orders'],
    prompt: 'Return order count per month. Show <code>month</code> (YYYY-MM) and count.',
    solution: "SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders FROM orders GROUP BY month ORDER BY month;"
  },
  {
    id: 'am11', company: 'amazon', topic: 'agg', difficulty: 'Easy',
    title: 'Products per category',
    tables: ['products'],
    prompt: 'Count products in each category. Show category and product_count.',
    solution: 'SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;'
  },
  {
    id: 'am12', company: 'amazon', topic: 'joins', difficulty: 'Medium',
    title: 'Customer total spent',
    tables: ['customers', 'orders'],
    prompt: 'For each customer, return name and total_spent. Sort desc.',
    solution: 'SELECT c.name, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name ORDER BY total_spent DESC;'
  },
  {
    id: 'am13', company: 'amazon', topic: 'subquery', difficulty: 'Hard',
    title: 'Customers with above-avg spend',
    tables: ['orders'],
    prompt: 'Find customer_ids whose total spend is above the average spend per customer. Show customer_id and total.',
    solution: 'SELECT customer_id, SUM(total_amount) AS total FROM orders GROUP BY customer_id HAVING SUM(total_amount) > (SELECT AVG(t) FROM (SELECT SUM(total_amount) AS t FROM orders GROUP BY customer_id) sub);'
  },
  {
    id: 'am14', company: 'amazon', topic: 'window', difficulty: 'Hard',
    title: 'Order revenue as % of total',
    tables: ['orders'],
    prompt: 'For each order, show order_id, total_amount, and <code>pct_of_total</code> (% of all revenue). Round to 2 decimals.',
    solution: 'SELECT order_id, total_amount, ROUND(100.0 * total_amount / SUM(total_amount) OVER (), 2) AS pct_of_total FROM orders;'
  },
  {
    id: 'am15', company: 'amazon', topic: 'basics', difficulty: 'Easy',
    title: 'Top 5 most expensive products',
    tables: ['products'],
    prompt: 'Return name and price of the 5 most expensive products.',
    solution: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5;'
  },
  {
    id: 'am16', company: 'amazon', topic: 'subquery', difficulty: 'Medium',
    title: 'Most expensive product per category',
    tables: ['products'],
    prompt: 'For each category, return the most expensive product. Show name, category, price.',
    solution: 'SELECT name, category, price FROM products p WHERE price = (SELECT MAX(price) FROM products WHERE category = p.category);'
  },
  {
    id: 'am17', company: 'amazon', topic: 'agg', difficulty: 'Easy',
    title: 'Average product price',
    tables: ['products'],
    prompt: 'What is the average price across all products? Round to 2 decimals.',
    solution: 'SELECT ROUND(AVG(price), 2) AS avg_price FROM products;'
  },
  {
    id: 'am18', company: 'amazon', topic: 'joins', difficulty: 'Medium',
    title: 'Items + product name + order date',
    tables: ['order_items', 'products', 'orders'],
    prompt: 'Join order_items + products + orders. Show order_id, order_date, product name, quantity. Sort by order_date.',
    solution: 'SELECT o.order_id, o.order_date, p.name, oi.quantity FROM order_items oi JOIN orders o ON oi.order_id = o.order_id JOIN products p ON oi.product_id = p.product_id ORDER BY o.order_date;'
  },

  /* ============================================
     META (Facebook) — 16 questions (social/graph)
     ============================================ */
  {
    id: 'me1', company: 'meta', topic: 'agg', difficulty: 'Easy',
    title: 'Total likes per user',
    tables: ['fb_posts'],
    prompt: 'For each user, return total likes across all their posts. Sort desc.',
    solution: 'SELECT user_id, SUM(likes) AS total_likes FROM fb_posts GROUP BY user_id ORDER BY total_likes DESC;'
  },
  {
    id: 'me2', company: 'meta', topic: 'agg', difficulty: 'Easy',
    title: 'Most active poster',
    tables: ['fb_posts'],
    prompt: 'Find the user with the most posts. Return user_id and post_count.',
    solution: 'SELECT user_id, COUNT(*) AS post_count FROM fb_posts GROUP BY user_id ORDER BY post_count DESC LIMIT 1;'
  },
  {
    id: 'me3', company: 'meta', topic: 'joins', difficulty: 'Easy',
    title: 'Posts with author name',
    tables: ['fb_users', 'fb_posts'],
    prompt: 'For every post, return post_id, the author\'s name, and likes.',
    solution: 'SELECT p.post_id, u.name, p.likes FROM fb_posts p JOIN fb_users u ON p.user_id = u.user_id;'
  },
  {
    id: 'me4', company: 'meta', topic: 'joins', difficulty: 'Medium',
    title: 'Users who never posted',
    tables: ['fb_users', 'fb_posts'],
    prompt: 'Find names of users who have <strong>never made a post</strong>.',
    solution: 'SELECT u.name FROM fb_users u LEFT JOIN fb_posts p ON u.user_id = p.user_id WHERE p.post_id IS NULL;'
  },
  {
    id: 'me5', company: 'meta', topic: 'window', difficulty: 'Medium',
    title: 'Rank posts by likes per user',
    tables: ['fb_posts'],
    prompt: 'For each user, rank their posts by likes (most-liked = 1). Show post_id, user_id, likes, post_rank.',
    solution: 'SELECT post_id, user_id, likes, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY likes DESC) AS post_rank FROM fb_posts;'
  },
  {
    id: 'me6', company: 'meta', topic: 'window', difficulty: 'Hard',
    title: 'Cumulative likes per user over time',
    tables: ['fb_posts'],
    prompt: 'For each post, return user_id, post_date, likes, and cumulative_likes (running total per user ordered by date).',
    solution: 'SELECT user_id, post_date, likes, SUM(likes) OVER (PARTITION BY user_id ORDER BY post_date) AS cumulative_likes FROM fb_posts ORDER BY user_id, post_date;'
  },
  {
    id: 'me7', company: 'meta', topic: 'advanced', difficulty: 'Hard',
    title: 'Mutual friends with user 1',
    tables: ['fb_friends'],
    prompt: 'For user_id = 1, return each of their friends (friend_id) along with how many <strong>mutual friends</strong> they share with user 1. Sort by mutual_count desc.',
    solution: 'SELECT f.friend_id, COUNT(*) AS mutual_count FROM fb_friends f JOIN fb_friends my ON f.friend_id = my.user_id AND my.friend_id IN (SELECT friend_id FROM fb_friends WHERE user_id = 1) WHERE f.user_id = 1 GROUP BY f.friend_id ORDER BY mutual_count DESC;'
  },
  {
    id: 'me8', company: 'meta', topic: 'agg', difficulty: 'Medium',
    title: 'Friend count per user',
    tables: ['fb_friends'],
    prompt: 'For each user, count how many friends they have. Show user_id and friend_count, sorted desc.',
    solution: 'SELECT user_id, COUNT(*) AS friend_count FROM fb_friends GROUP BY user_id ORDER BY friend_count DESC;'
  },
  {
    id: 'me9', company: 'meta', topic: 'agg', difficulty: 'Medium',
    title: 'Average likes per user',
    tables: ['fb_posts'],
    prompt: 'For each user, return average likes per post rounded to 1 decimal. Sort desc.',
    solution: 'SELECT user_id, ROUND(AVG(likes), 1) AS avg_likes FROM fb_posts GROUP BY user_id ORDER BY avg_likes DESC;'
  },
  {
    id: 'me10', company: 'meta', topic: 'datetime', difficulty: 'Easy',
    title: 'Posts in March 2024',
    tables: ['fb_posts'],
    prompt: 'Return all posts (all columns) from March 2024.',
    solution: "SELECT * FROM fb_posts WHERE strftime('%Y-%m', post_date) = '2024-03';"
  },
  {
    id: 'me11', company: 'meta', topic: 'joins', difficulty: 'Medium',
    title: 'Posts with author city',
    tables: ['fb_users', 'fb_posts'],
    prompt: 'For each post, return post_id, the author\'s name, the author\'s city, and likes.',
    solution: 'SELECT p.post_id, u.name, u.city, p.likes FROM fb_posts p JOIN fb_users u ON p.user_id = u.user_id;'
  },
  {
    id: 'me12', company: 'meta', topic: 'agg', difficulty: 'Medium',
    title: 'Users per city',
    tables: ['fb_users'],
    prompt: 'Count users per city. Show city and user count, sorted desc.',
    solution: 'SELECT city, COUNT(*) AS users FROM fb_users GROUP BY city ORDER BY users DESC;'
  },
  {
    id: 'me13', company: 'meta', topic: 'basics', difficulty: 'Easy',
    title: 'Posts with 30+ likes',
    tables: ['fb_posts'],
    prompt: 'Return all posts (all columns) with more than 30 likes, sorted by likes desc.',
    solution: 'SELECT * FROM fb_posts WHERE likes > 30 ORDER BY likes DESC;'
  },
  {
    id: 'me14', company: 'meta', topic: 'window', difficulty: 'Hard',
    title: 'Top 2 posts per user',
    tables: ['fb_posts'],
    prompt: 'For each user, return their <strong>top 2 most-liked posts</strong>. Show user_id, post_id, likes.',
    solution: 'WITH ranked AS (SELECT user_id, post_id, likes, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY likes DESC) AS rn FROM fb_posts) SELECT user_id, post_id, likes FROM ranked WHERE rn <= 2 ORDER BY user_id, likes DESC;'
  },
  {
    id: 'me15', company: 'meta', topic: 'subquery', difficulty: 'Hard',
    title: 'Users above average post count',
    tables: ['fb_posts'],
    prompt: 'Find users whose <strong>total post count is above the average</strong> post count per user. Show user_id and posts.',
    solution: 'SELECT user_id, COUNT(*) AS posts FROM fb_posts GROUP BY user_id HAVING COUNT(*) > (SELECT AVG(c) FROM (SELECT COUNT(*) AS c FROM fb_posts GROUP BY user_id) sub);'
  },
  {
    id: 'me16', company: 'meta', topic: 'advanced', difficulty: 'Medium',
    title: 'Friends-of-friends (2nd-degree)',
    tables: ['fb_friends'],
    prompt: 'For user_id = 1, return distinct user_ids who are <strong>friends-of-friends</strong> but not direct friends and not user 1 itself.',
    solution: 'SELECT DISTINCT f2.friend_id FROM fb_friends f1 JOIN fb_friends f2 ON f1.friend_id = f2.user_id WHERE f1.user_id = 1 AND f2.friend_id != 1 AND f2.friend_id NOT IN (SELECT friend_id FROM fb_friends WHERE user_id = 1);'
  },

  /* ============================================
     NETFLIX — 12 questions (sessions, viewing)
     ============================================ */
  {
    id: 'n1', company: 'netflix', topic: 'agg', difficulty: 'Medium',
    title: 'Average session duration per user',
    tables: ['user_sessions'],
    prompt: 'For each user, return the average session duration rounded to 1 decimal.',
    solution: 'SELECT user_id, ROUND(AVG(duration), 1) AS avg_duration FROM user_sessions GROUP BY user_id;'
  },
  {
    id: 'n2', company: 'netflix', topic: 'agg', difficulty: 'Medium',
    title: 'Longest session per user',
    tables: ['user_sessions'],
    prompt: 'For each user, return user_id and their <strong>longest session duration</strong>.',
    solution: 'SELECT user_id, MAX(duration) AS max_duration FROM user_sessions GROUP BY user_id;'
  },
  {
    id: 'n3', company: 'netflix', topic: 'window', difficulty: 'Hard',
    title: 'Delta between consecutive sessions',
    tables: ['user_sessions'],
    prompt: 'For each session, return session_id, user_id, duration, and <code>delta</code> = duration - previous session\'s duration for the same user (ordered by session_ts).',
    solution: 'SELECT session_id, user_id, duration, duration - LAG(duration) OVER (PARTITION BY user_id ORDER BY session_ts) AS delta FROM user_sessions ORDER BY user_id, session_ts;'
  },
  {
    id: 'n4', company: 'netflix', topic: 'datetime', difficulty: 'Medium',
    title: 'Sessions per day',
    tables: ['user_sessions'],
    prompt: "Count sessions per date. Show <code>date</code> and session_count.",
    solution: "SELECT DATE(session_ts) AS date, COUNT(*) AS session_count FROM user_sessions GROUP BY date ORDER BY date;"
  },
  {
    id: 'n5', company: 'netflix', topic: 'datetime', difficulty: 'Medium',
    title: 'Sessions by hour of day',
    tables: ['user_sessions'],
    prompt: "Return hour-of-day (0-23) and session count. Sort by hour.",
    solution: "SELECT strftime('%H', session_ts) AS hour, COUNT(*) AS sessions FROM user_sessions GROUP BY hour ORDER BY hour;"
  },
  {
    id: 'n6', company: 'netflix', topic: 'agg', difficulty: 'Easy',
    title: 'Total watch time per user',
    tables: ['user_sessions'],
    prompt: 'For each user, return the total minutes watched (sum of duration).',
    solution: 'SELECT user_id, SUM(duration) AS total_minutes FROM user_sessions GROUP BY user_id ORDER BY total_minutes DESC;'
  },
  {
    id: 'n7', company: 'netflix', topic: 'agg', difficulty: 'Medium',
    title: 'Sessions over 20 minutes',
    tables: ['user_sessions'],
    prompt: 'Find users who had at least one session longer than 20 minutes. Return distinct user_ids.',
    solution: 'SELECT DISTINCT user_id FROM user_sessions WHERE duration > 20;'
  },
  {
    id: 'n8', company: 'netflix', topic: 'window', difficulty: 'Hard',
    title: 'First and last session per user',
    tables: ['user_sessions'],
    prompt: 'For each user, return the timestamp of their first and last session as <code>first_ts</code> and <code>last_ts</code>.',
    solution: 'SELECT user_id, MIN(session_ts) AS first_ts, MAX(session_ts) AS last_ts FROM user_sessions GROUP BY user_id;'
  },
  {
    id: 'n9', company: 'netflix', topic: 'advanced', difficulty: 'Hard',
    title: 'Daily active users (DAU)',
    tables: ['user_sessions'],
    prompt: "For each date, count <strong>distinct active users</strong>. Show date and DAU.",
    solution: "SELECT DATE(session_ts) AS date, COUNT(DISTINCT user_id) AS dau FROM user_sessions GROUP BY date ORDER BY date;"
  },
  {
    id: 'n10', company: 'netflix', topic: 'window', difficulty: 'Hard',
    title: 'Rolling avg duration (3 sessions per user)',
    tables: ['user_sessions'],
    prompt: 'For each session ordered by time per user, compute the rolling average duration over the last 3 sessions (including current).',
    solution: 'SELECT user_id, session_ts, duration, AVG(duration) OVER (PARTITION BY user_id ORDER BY session_ts ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_avg FROM user_sessions ORDER BY user_id, session_ts;'
  },
  {
    id: 'n11', company: 'netflix', topic: 'agg', difficulty: 'Medium',
    title: 'Power users (10+ minutes avg)',
    tables: ['user_sessions'],
    prompt: 'Find users whose average session duration is <strong>at least 15 minutes</strong>. Show user_id and avg_duration.',
    solution: 'SELECT user_id, ROUND(AVG(duration), 1) AS avg_duration FROM user_sessions GROUP BY user_id HAVING AVG(duration) >= 15;'
  },
  {
    id: 'n12', company: 'netflix', topic: 'subquery', difficulty: 'Hard',
    title: 'Users with above-avg total watch time',
    tables: ['user_sessions'],
    prompt: 'Find users whose <strong>total watch time exceeds the average total</strong> watch time across all users.',
    solution: 'SELECT user_id, SUM(duration) AS total FROM user_sessions GROUP BY user_id HAVING SUM(duration) > (SELECT AVG(t) FROM (SELECT SUM(duration) AS t FROM user_sessions GROUP BY user_id) sub);'
  },

  /* ============================================
     APPLE — 10 questions (hierarchies, schema)
     ============================================ */
  {
    id: 'ap1', company: 'apple', topic: 'joins', difficulty: 'Medium',
    title: 'Employee + manager name (self-join)',
    tables: ['employees'],
    prompt: 'For each employee, return their name as <code>employee</code> and their manager\'s name as <code>manager</code>. Include top-level managers with NULL.',
    solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.employee_id;'
  },
  {
    id: 'ap2', company: 'apple', topic: 'joins', difficulty: 'Medium',
    title: 'Direct report counts',
    tables: ['employees'],
    prompt: 'For each manager, return manager name and number of direct reports. Sort desc.',
    solution: 'SELECT m.name AS manager, COUNT(e.employee_id) AS reports FROM employees m JOIN employees e ON e.manager_id = m.employee_id GROUP BY m.name ORDER BY reports DESC;'
  },
  {
    id: 'ap3', company: 'apple', topic: 'subquery', difficulty: 'Hard',
    title: 'Employees earning more than their manager',
    tables: ['employees'],
    prompt: 'Find employees whose salary is <strong>greater than their manager\'s salary</strong>. Show employee name, salary, manager name, and manager salary.',
    solution: 'SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary FROM employees e JOIN employees m ON e.manager_id = m.employee_id WHERE e.salary > m.salary;'
  },
  {
    id: 'ap4', company: 'apple', topic: 'basics', difficulty: 'Easy',
    title: 'Top-level managers',
    tables: ['employees'],
    prompt: 'Find every employee with <code>manager_id IS NULL</code>. Return name and department.',
    solution: 'SELECT name, department FROM employees WHERE manager_id IS NULL;'
  },
  {
    id: 'ap5', company: 'apple', topic: 'agg', difficulty: 'Medium',
    title: 'Department sizes',
    tables: ['employees'],
    prompt: 'Return department and count of employees per department.',
    solution: 'SELECT department, COUNT(*) AS employees FROM employees GROUP BY department ORDER BY employees DESC;'
  },
  {
    id: 'ap6', company: 'apple', topic: 'agg', difficulty: 'Medium',
    title: 'Min/Max salary per department',
    tables: ['employees'],
    prompt: 'For each department, return min and max salary as <code>min_salary</code> and <code>max_salary</code>.',
    solution: 'SELECT department, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees GROUP BY department;'
  },
  {
    id: 'ap7', company: 'apple', topic: 'subquery', difficulty: 'Medium',
    title: 'Highest-paid employee',
    tables: ['employees'],
    prompt: 'Return name and salary of the highest-paid employee in the company.',
    solution: 'SELECT name, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);'
  },
  {
    id: 'ap8', company: 'apple', topic: 'advanced', difficulty: 'Hard',
    title: 'Manager + total team salary',
    tables: ['employees'],
    prompt: 'For each manager, return manager name and the <strong>total salary of their team</strong> (direct reports only).',
    solution: 'SELECT m.name AS manager, SUM(e.salary) AS team_salary FROM employees m JOIN employees e ON e.manager_id = m.employee_id GROUP BY m.name ORDER BY team_salary DESC;'
  },
  {
    id: 'ap9', company: 'apple', topic: 'datetime', difficulty: 'Medium',
    title: 'Tenure in years',
    tables: ['employees'],
    prompt: "For each employee, calculate their tenure in years from hire_date to today's date '2024-12-31'. Show name and <code>tenure_years</code>.",
    solution: "SELECT name, ROUND((julianday('2024-12-31') - julianday(hire_date)) / 365.0, 1) AS tenure_years FROM employees ORDER BY tenure_years DESC;"
  },
  {
    id: 'ap10', company: 'apple', topic: 'subquery', difficulty: 'Hard',
    title: 'Above-avg salary in dept',
    tables: ['employees'],
    prompt: 'Find employees who earn more than their department\'s average salary.',
    solution: 'SELECT name, department, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);'
  },

  /* ============================================
     MICROSOFT — 14 questions (T-SQL flavored)
     ============================================ */
  {
    id: 'ms1', company: 'microsoft', topic: 'advanced', difficulty: 'Medium',
    title: 'Finding Updated Records (the famous one)',
    tables: ['ms_employee_salary'],
    prompt: "Some salary records are outdated. Assume salary is non-decreasing over time, so the <strong>current salary is the MAX</strong> per employee. Return id, first_name, last_name, department_id, and current salary. Order by id.",
    solution: 'SELECT id, first_name, last_name, department_id, MAX(salary) AS salary FROM ms_employee_salary GROUP BY id, first_name, last_name, department_id ORDER BY id;'
  },
  {
    id: 'ms2', company: 'microsoft', topic: 'advanced', difficulty: 'Hard',
    title: 'Department top 3 (LeetCode #185)',
    tables: ['employees'],
    prompt: 'Return employees earning one of the <strong>top 3 unique salaries in their department</strong>. Show department, name, salary, sorted by department, salary desc.',
    solution: 'WITH ranked AS (SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees) SELECT department, name, salary FROM ranked WHERE rnk <= 3 ORDER BY department, salary DESC;'
  },
  {
    id: 'ms3', company: 'microsoft', topic: 'string', difficulty: 'Easy',
    title: 'Full name concatenation',
    tables: ['ms_employee_salary'],
    prompt: "Return <code>full_name</code> = first_name + ' ' + last_name and salary for each row.",
    solution: "SELECT first_name || ' ' || last_name AS full_name, salary FROM ms_employee_salary;"
  },
  {
    id: 'ms4', company: 'microsoft', topic: 'agg', difficulty: 'Medium',
    title: 'Total salary per department',
    tables: ['ms_employee_salary'],
    prompt: 'For each <code>department_id</code>, return total salary across all current records. Use MAX salary per employee first.',
    solution: 'WITH current_salaries AS (SELECT id, department_id, MAX(salary) AS salary FROM ms_employee_salary GROUP BY id, department_id) SELECT department_id, SUM(salary) AS total_salary FROM current_salaries GROUP BY department_id;'
  },
  {
    id: 'ms5', company: 'microsoft', topic: 'subquery', difficulty: 'Medium',
    title: 'Second highest salary',
    tables: ['employees'],
    prompt: 'Return the second-highest distinct salary as <code>second_highest</code>.',
    solution: 'SELECT MAX(salary) AS second_highest FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);'
  },
  {
    id: 'ms6', company: 'microsoft', topic: 'window', difficulty: 'Medium',
    title: 'Rank by salary in department',
    tables: ['employees'],
    prompt: 'Return name, department, salary, and dept_rank using DENSE_RANK partitioned by department.',
    solution: 'SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;'
  },
  {
    id: 'ms7', company: 'microsoft', topic: 'agg', difficulty: 'Medium',
    title: 'Departments with avg salary > $90k',
    tables: ['employees'],
    prompt: 'Find departments where average salary exceeds $90,000. Show department and avg_salary.',
    solution: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 90000;'
  },
  {
    id: 'ms8', company: 'microsoft', topic: 'joins', difficulty: 'Medium',
    title: 'Self-join: manager + reports',
    tables: ['employees'],
    prompt: 'For every manager-employee pair, return employee name and manager name.',
    solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.employee_id;'
  },
  {
    id: 'ms9', company: 'microsoft', topic: 'string', difficulty: 'Medium',
    title: 'Initial + last name',
    tables: ['ms_employee_salary'],
    prompt: "Return name as <code>initial. last_name</code> (e.g., 'A. Wang'). Show id and the formatted name.",
    solution: "SELECT id, SUBSTR(first_name, 1, 1) || '. ' || last_name AS display_name FROM ms_employee_salary;"
  },
  {
    id: 'ms10', company: 'microsoft', topic: 'datetime', difficulty: 'Medium',
    title: 'Employees hired in 2023',
    tables: ['employees'],
    prompt: 'Return employees hired in year 2023. Show name, department, hire_date.',
    solution: "SELECT name, department, hire_date FROM employees WHERE strftime('%Y', hire_date) = '2023';"
  },
  {
    id: 'ms11', company: 'microsoft', topic: 'advanced', difficulty: 'Hard',
    title: 'Employee count per department + rank',
    tables: ['employees'],
    prompt: 'For each department, return department name, count of employees, and a rank of departments by size (largest = 1).',
    solution: 'WITH counts AS (SELECT department, COUNT(*) AS n FROM employees GROUP BY department) SELECT department, n, RANK() OVER (ORDER BY n DESC) AS size_rank FROM counts;'
  },
  {
    id: 'ms12', company: 'microsoft', topic: 'subquery', difficulty: 'Medium',
    title: 'Distinct department_ids in current records',
    tables: ['ms_employee_salary'],
    prompt: 'Return distinct department_ids that appear in the current (max salary) records per employee.',
    solution: 'SELECT DISTINCT department_id FROM (SELECT id, department_id, MAX(salary) AS sal FROM ms_employee_salary GROUP BY id, department_id) sub;'
  },
  {
    id: 'ms13', company: 'microsoft', topic: 'window', difficulty: 'Hard',
    title: 'Salary trajectory per employee',
    tables: ['ms_employee_salary'],
    prompt: 'For each employee\'s salary records (ordered by salary asc), show id, salary, and the difference from the previous record (delta).',
    solution: 'SELECT id, salary, salary - LAG(salary) OVER (PARTITION BY id ORDER BY salary) AS delta FROM ms_employee_salary ORDER BY id, salary;'
  },
  {
    id: 'ms14', company: 'microsoft', topic: 'agg', difficulty: 'Easy',
    title: 'Count distinct employees',
    tables: ['ms_employee_salary'],
    prompt: 'Return the count of distinct employee ids in ms_employee_salary.',
    solution: 'SELECT COUNT(DISTINCT id) AS unique_employees FROM ms_employee_salary;'
  },

  /* ============================================
     UBER — 12 questions (trips, cancellations)
     ============================================ */
  {
    id: 'u1', company: 'uber', topic: 'advanced', difficulty: 'Hard',
    title: 'Cancellation rate per day',
    tables: ['trips'],
    prompt: 'For each request_date, return the date and <strong>cancellation rate</strong> (fraction of cancelled trips), rounded to 2 decimals.',
    solution: "SELECT request_date, ROUND(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 2) AS cancellation_rate FROM trips GROUP BY request_date ORDER BY request_date;"
  },
  {
    id: 'u2', company: 'uber', topic: 'agg', difficulty: 'Easy',
    title: 'Completed trips per driver',
    tables: ['trips'],
    prompt: "Count completed trips per driver_id. Sort desc.",
    solution: "SELECT driver_id, COUNT(*) AS completed FROM trips WHERE status = 'completed' GROUP BY driver_id ORDER BY completed DESC;"
  },
  {
    id: 'u3', company: 'uber', topic: 'agg', difficulty: 'Medium',
    title: 'Top earning drivers',
    tables: ['trips'],
    prompt: 'For each driver, sum up fare from completed trips and return driver_id and earnings. Sort desc.',
    solution: "SELECT driver_id, SUM(fare) AS earnings FROM trips WHERE status = 'completed' GROUP BY driver_id ORDER BY earnings DESC;"
  },
  {
    id: 'u4', company: 'uber', topic: 'agg', difficulty: 'Medium',
    title: 'Average fare per day',
    tables: ['trips'],
    prompt: 'For each request_date, average fare across completed trips only.',
    solution: "SELECT request_date, ROUND(AVG(fare), 2) AS avg_fare FROM trips WHERE status = 'completed' GROUP BY request_date;"
  },
  {
    id: 'u5', company: 'uber', topic: 'basics', difficulty: 'Easy',
    title: 'All cancelled trips',
    tables: ['trips'],
    prompt: 'Return all trips with status cancelled. All columns.',
    solution: "SELECT * FROM trips WHERE status = 'cancelled';"
  },
  {
    id: 'u6', company: 'uber', topic: 'subquery', difficulty: 'Hard',
    title: 'Riders with more than 1 cancelled trip',
    tables: ['trips'],
    prompt: 'Find rider_ids who have <strong>cancelled more than one trip</strong>. Show rider_id and cancel_count.',
    solution: "SELECT rider_id, COUNT(*) AS cancel_count FROM trips WHERE status = 'cancelled' GROUP BY rider_id HAVING COUNT(*) > 1;"
  },
  {
    id: 'u7', company: 'uber', topic: 'window', difficulty: 'Hard',
    title: 'Cumulative fare per driver over time',
    tables: ['trips'],
    prompt: 'For each completed trip, show driver_id, request_date, fare, and cumulative fare per driver ordered by date.',
    solution: "SELECT driver_id, request_date, fare, SUM(fare) OVER (PARTITION BY driver_id ORDER BY request_date) AS cum_fare FROM trips WHERE status = 'completed' ORDER BY driver_id, request_date;"
  },
  {
    id: 'u8', company: 'uber', topic: 'agg', difficulty: 'Medium',
    title: 'Trips per rider with status breakdown',
    tables: ['trips'],
    prompt: 'For each rider_id, return total trips, completed count, and cancelled count (use conditional aggregation).',
    solution: "SELECT rider_id, COUNT(*) AS total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled FROM trips GROUP BY rider_id;"
  },
  {
    id: 'u9', company: 'uber', topic: 'window', difficulty: 'Hard',
    title: 'Driver rank by total earnings',
    tables: ['trips'],
    prompt: 'Rank drivers by total completed-trip earnings. Show driver_id, earnings, and rank.',
    solution: "WITH earnings AS (SELECT driver_id, SUM(fare) AS total FROM trips WHERE status = 'completed' GROUP BY driver_id) SELECT driver_id, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM earnings;"
  },
  {
    id: 'u10', company: 'uber', topic: 'subquery', difficulty: 'Medium',
    title: 'Rider above average fare',
    tables: ['trips'],
    prompt: 'Find rider_ids whose <strong>total spend (sum of fare on completed trips) exceeds the average</strong> total spend per rider.',
    solution: "SELECT rider_id, SUM(fare) AS spent FROM trips WHERE status = 'completed' GROUP BY rider_id HAVING SUM(fare) > (SELECT AVG(s) FROM (SELECT SUM(fare) AS s FROM trips WHERE status = 'completed' GROUP BY rider_id) sub);"
  },
  {
    id: 'u11', company: 'uber', topic: 'datetime', difficulty: 'Medium',
    title: 'Trips per weekday',
    tables: ['trips'],
    prompt: "Group trips by day-of-week (0=Sun, 6=Sat). Show dow and trip count.",
    solution: "SELECT strftime('%w', request_date) AS dow, COUNT(*) AS trips FROM trips GROUP BY dow ORDER BY dow;"
  },
  {
    id: 'u12', company: 'uber', topic: 'advanced', difficulty: 'Hard',
    title: 'Trip count + completion rate per driver',
    tables: ['trips'],
    prompt: 'For each driver, return driver_id, total trips, completed trips, and completion rate (as a 2-decimal fraction).',
    solution: "SELECT driver_id, COUNT(*) AS total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed, ROUND(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 2) AS completion_rate FROM trips GROUP BY driver_id;"
  },

  /* ============================================
     AIRBNB — 8 questions (bookings/listings)
     ============================================ */
  {
    id: 'ab1', company: 'airbnb', topic: 'agg', difficulty: 'Easy',
    title: 'Bookings per status',
    tables: ['orders'],
    prompt: "Treating orders as bookings, count orders per status.",
    solution: 'SELECT status, COUNT(*) AS bookings FROM orders GROUP BY status;'
  },
  {
    id: 'ab2', company: 'airbnb', topic: 'datetime', difficulty: 'Medium',
    title: 'Monthly booking trends',
    tables: ['orders'],
    prompt: 'For each month, return total bookings and total revenue (treating orders as bookings).',
    solution: "SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS bookings, SUM(total_amount) AS revenue FROM orders GROUP BY month ORDER BY month;"
  },
  {
    id: 'ab3', company: 'airbnb', topic: 'joins', difficulty: 'Medium',
    title: 'Customer + total bookings',
    tables: ['customers', 'orders'],
    prompt: 'For each customer (treat as host), return name and number of bookings (orders).',
    solution: 'SELECT c.name, COUNT(o.order_id) AS bookings FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name ORDER BY bookings DESC;'
  },
  {
    id: 'ab4', company: 'airbnb', topic: 'agg', difficulty: 'Medium',
    title: 'Bookings per country',
    tables: ['customers', 'orders'],
    prompt: 'Group orders by the customer\'s country. Return country and total bookings.',
    solution: 'SELECT c.country, COUNT(*) AS bookings FROM orders o JOIN customers c ON o.customer_id = c.customer_id GROUP BY c.country ORDER BY bookings DESC;'
  },
  {
    id: 'ab5', company: 'airbnb', topic: 'advanced', difficulty: 'Hard',
    title: 'Average booking value per country',
    tables: ['customers', 'orders'],
    prompt: 'For each country, return the average <code>total_amount</code> of bookings, rounded to 2 decimals. Sort desc.',
    solution: 'SELECT c.country, ROUND(AVG(o.total_amount), 2) AS avg_value FROM orders o JOIN customers c ON o.customer_id = c.customer_id GROUP BY c.country ORDER BY avg_value DESC;'
  },
  {
    id: 'ab6', company: 'airbnb', topic: 'window', difficulty: 'Hard',
    title: 'First booking per customer',
    tables: ['customers', 'orders'],
    prompt: 'For each customer, return the <strong>first booking</strong> (earliest order_date). Show customer name, order_id, order_date.',
    solution: 'WITH ranked AS (SELECT o.*, c.name, ROW_NUMBER() OVER (PARTITION BY o.customer_id ORDER BY o.order_date) AS rn FROM orders o JOIN customers c ON o.customer_id = c.customer_id) SELECT name, order_id, order_date FROM ranked WHERE rn = 1;'
  },
  {
    id: 'ab7', company: 'airbnb', topic: 'agg', difficulty: 'Medium',
    title: 'Repeat bookers',
    tables: ['orders'],
    prompt: 'Find customer_ids who have made <strong>more than 1 booking</strong>. Show customer_id and booking count.',
    solution: 'SELECT customer_id, COUNT(*) AS bookings FROM orders GROUP BY customer_id HAVING COUNT(*) > 1;'
  },
  {
    id: 'ab8', company: 'airbnb', topic: 'datetime', difficulty: 'Medium',
    title: 'Cohort: customers signed up + booked',
    tables: ['customers', 'orders'],
    prompt: 'For each customer, return signup_date, the date of their first booking, and days between.',
    solution: "SELECT c.name, c.signup_date, MIN(o.order_date) AS first_booking, julianday(MIN(o.order_date)) - julianday(c.signup_date) AS days_to_first FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name, c.signup_date ORDER BY days_to_first;"
  },

  /* ============================================
     STRIPE — 12 questions (revenue, growth, fraud)
     ============================================ */
  {
    id: 'st1', company: 'stripe', topic: 'agg', difficulty: 'Easy',
    title: 'Total revenue (delivered only)',
    tables: ['orders'],
    prompt: 'Return total revenue from delivered orders as a single column called <code>revenue</code>.',
    solution: "SELECT SUM(total_amount) AS revenue FROM orders WHERE status = 'delivered';"
  },
  {
    id: 'st2', company: 'stripe', topic: 'advanced', difficulty: 'Hard',
    title: 'Month-over-month revenue growth %',
    tables: ['orders'],
    prompt: 'For each month, return month, revenue, prev month revenue, and growth_pct (rounded to 2 decimals). Use LAG.',
    solution: "WITH monthly AS (SELECT strftime('%Y-%m', order_date) AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month) SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev_rev, ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 2) AS growth_pct FROM monthly ORDER BY month;"
  },
  {
    id: 'st3', company: 'stripe', topic: 'agg', difficulty: 'Easy',
    title: 'Revenue per customer',
    tables: ['orders'],
    prompt: 'Sum total_amount per customer. Show customer_id and revenue.',
    solution: 'SELECT customer_id, SUM(total_amount) AS revenue FROM orders GROUP BY customer_id ORDER BY revenue DESC;'
  },
  {
    id: 'st4', company: 'stripe', topic: 'window', difficulty: 'Medium',
    title: 'Running total of all revenue',
    tables: ['orders'],
    prompt: 'For each order, show order_id, order_date, amount, and running total of revenue ordered by date.',
    solution: 'SELECT order_id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date) AS running_total FROM orders ORDER BY order_date;'
  },
  {
    id: 'st5', company: 'stripe', topic: 'datetime', difficulty: 'Medium',
    title: 'Year-to-date revenue',
    tables: ['orders'],
    prompt: 'For each order, return order_date, total_amount, and <code>ytd</code> running total of revenue within the same year.',
    solution: "SELECT order_date, total_amount, SUM(total_amount) OVER (PARTITION BY strftime('%Y', order_date) ORDER BY order_date) AS ytd FROM orders;"
  },
  {
    id: 'st6', company: 'stripe', topic: 'advanced', difficulty: 'Hard',
    title: 'Failed payment rate (status = cancelled)',
    tables: ['orders'],
    prompt: 'Return total orders, cancelled orders, and the cancellation rate as a percent rounded to 2 decimals.',
    solution: "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled, ROUND(100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 2) AS cancel_rate_pct FROM orders;"
  },
  {
    id: 'st7', company: 'stripe', topic: 'agg', difficulty: 'Medium',
    title: 'Average order value (AOV)',
    tables: ['orders'],
    prompt: 'Return the average order value across delivered orders. Round to 2 decimals.',
    solution: "SELECT ROUND(AVG(total_amount), 2) AS aov FROM orders WHERE status = 'delivered';"
  },
  {
    id: 'st8', company: 'stripe', topic: 'window', difficulty: 'Hard',
    title: 'Order vs previous + delta',
    tables: ['orders'],
    prompt: 'Show order_id, order_date, total_amount, previous order amount, and the delta. Use LAG.',
    solution: 'SELECT order_id, order_date, total_amount, LAG(total_amount) OVER (ORDER BY order_date) AS prev, total_amount - LAG(total_amount) OVER (ORDER BY order_date) AS delta FROM orders ORDER BY order_date;'
  },
  {
    id: 'st9', company: 'stripe', topic: 'subquery', difficulty: 'Medium',
    title: 'Orders above average value',
    tables: ['orders'],
    prompt: 'Find orders with total_amount above the overall average. Show order_id and total_amount.',
    solution: 'SELECT order_id, total_amount FROM orders WHERE total_amount > (SELECT AVG(total_amount) FROM orders);'
  },
  {
    id: 'st10', company: 'stripe', topic: 'datetime', difficulty: 'Medium',
    title: 'Revenue per month',
    tables: ['orders'],
    prompt: "Sum revenue per month. Show month (YYYY-MM) and revenue.",
    solution: "SELECT strftime('%Y-%m', order_date) AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month ORDER BY month;"
  },
  {
    id: 'st11', company: 'stripe', topic: 'agg', difficulty: 'Medium',
    title: 'First and last order date',
    tables: ['orders'],
    prompt: 'For each customer, return first_order and last_order dates.',
    solution: 'SELECT customer_id, MIN(order_date) AS first_order, MAX(order_date) AS last_order FROM orders GROUP BY customer_id;'
  },
  {
    id: 'st12', company: 'stripe', topic: 'advanced', difficulty: 'Hard',
    title: 'Repeat purchase rate',
    tables: ['orders'],
    prompt: 'What % of customers have placed more than 1 order? Return repeat_rate_pct (rounded to 2 decimals).',
    solution: 'SELECT ROUND(100.0 * SUM(CASE WHEN orders > 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS repeat_rate_pct FROM (SELECT customer_id, COUNT(*) AS orders FROM orders GROUP BY customer_id) sub;'
  },

  /* ============================================
     LINKEDIN — 8 questions (network, recursion)
     ============================================ */
  {
    id: 'li1', company: 'linkedin', topic: 'agg', difficulty: 'Medium',
    title: 'Connection count per user',
    tables: ['fb_friends'],
    prompt: 'Count connections per user_id (treating fb_friends as the connections table).',
    solution: 'SELECT user_id, COUNT(*) AS connections FROM fb_friends GROUP BY user_id ORDER BY connections DESC;'
  },
  {
    id: 'li2', company: 'linkedin', topic: 'advanced', difficulty: 'Hard',
    title: 'Mutual connections with user 1',
    tables: ['fb_friends'],
    prompt: 'For user 1, return each connection and the mutual_count they share with user 1.',
    solution: 'SELECT f.friend_id, COUNT(*) AS mutual FROM fb_friends f JOIN fb_friends my ON f.friend_id = my.user_id AND my.friend_id IN (SELECT friend_id FROM fb_friends WHERE user_id = 1) WHERE f.user_id = 1 GROUP BY f.friend_id ORDER BY mutual DESC;'
  },
  {
    id: 'li3', company: 'linkedin', topic: 'subquery', difficulty: 'Hard',
    title: 'People you may know (2nd-degree)',
    tables: ['fb_friends'],
    prompt: 'For user 1, find distinct 2nd-degree connections (friends of friends) excluding user 1 and their direct connections.',
    solution: 'SELECT DISTINCT f2.friend_id FROM fb_friends f1 JOIN fb_friends f2 ON f1.friend_id = f2.user_id WHERE f1.user_id = 1 AND f2.friend_id != 1 AND f2.friend_id NOT IN (SELECT friend_id FROM fb_friends WHERE user_id = 1);'
  },
  {
    id: 'li4', company: 'linkedin', topic: 'subquery', difficulty: 'Medium',
    title: 'Recursive — generate 1 to 10',
    tables: [],
    prompt: 'Use a recursive CTE to generate numbers 1 through 10 in column <code>n</code>.',
    solution: 'WITH RECURSIVE nums AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM nums WHERE n < 10) SELECT * FROM nums;'
  },
  {
    id: 'li5', company: 'linkedin', topic: 'joins', difficulty: 'Medium',
    title: 'User names + their connections names',
    tables: ['fb_users', 'fb_friends'],
    prompt: 'Join fb_friends with fb_users twice to show user name and friend name for every connection.',
    solution: 'SELECT u1.name AS user, u2.name AS friend FROM fb_friends f JOIN fb_users u1 ON f.user_id = u1.user_id JOIN fb_users u2 ON f.friend_id = u2.user_id;'
  },
  {
    id: 'li6', company: 'linkedin', topic: 'agg', difficulty: 'Medium',
    title: 'Users with most connections per city',
    tables: ['fb_users', 'fb_friends'],
    prompt: 'For each city, return the user with the most connections. Show city, name, connection_count.',
    solution: 'WITH conn AS (SELECT u.user_id, u.name, u.city, COUNT(f.friend_id) AS n FROM fb_users u JOIN fb_friends f ON u.user_id = f.user_id GROUP BY u.user_id, u.name, u.city), ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY city ORDER BY n DESC) AS rn FROM conn) SELECT city, name, n AS connection_count FROM ranked WHERE rn = 1;'
  },
  {
    id: 'li7', company: 'linkedin', topic: 'subquery', difficulty: 'Medium',
    title: 'Users with above-avg connections',
    tables: ['fb_friends'],
    prompt: 'Find users whose connection count is above the average. Show user_id and count.',
    solution: 'SELECT user_id, COUNT(*) AS connections FROM fb_friends GROUP BY user_id HAVING COUNT(*) > (SELECT AVG(c) FROM (SELECT COUNT(*) AS c FROM fb_friends GROUP BY user_id) sub);'
  },
  {
    id: 'li8', company: 'linkedin', topic: 'advanced', difficulty: 'Hard',
    title: 'Bidirectional friendship pairs',
    tables: ['fb_friends'],
    prompt: 'Find pairs (a, b) where a is friend of b AND b is friend of a. Show user_id and friend_id, avoiding duplicates (only show each pair once where user_id < friend_id).',
    solution: 'SELECT DISTINCT f1.user_id, f1.friend_id FROM fb_friends f1 JOIN fb_friends f2 ON f1.user_id = f2.friend_id AND f1.friend_id = f2.user_id WHERE f1.user_id < f1.friend_id;'
  }
];

// Computed counts per company for sidebar badges
window.getCompanyQuestionCount = function(companyId) {
  if (companyId === 'all') return window.COMPANY_QUESTIONS.length;
  return window.COMPANY_QUESTIONS.filter(q => q.company === companyId).length;
};

window.getTopicQuestionCount = function(topicId, companyId) {
  let qs = window.COMPANY_QUESTIONS;
  if (companyId && companyId !== 'all') qs = qs.filter(q => q.company === companyId);
  if (topicId === 'all') return qs.length;
  return qs.filter(q => q.topic === topicId).length;
};
