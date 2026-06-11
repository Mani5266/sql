/* ============================================
   SQLSENSEI — Interview Prep Data
   Real interview questions tagged by company, topic,
   difficulty, and frequency. Includes the famous
   "easy but everyone gets wrong" trick questions.
   ============================================ */

window.INTERVIEW = {

  /* ==================== COMPANIES ==================== */
  companies: [
    { id: 'google',     name: 'Google',     emoji: '🔵', focus: 'Window functions, optimization, complex aggregations on huge data' },
    { id: 'amazon',     name: 'Amazon',     emoji: '📦', focus: 'Real business metrics, leadership principle alignment via data, top-N per group' },
    { id: 'meta',       name: 'Meta',       emoji: '👤', focus: 'Social graph queries, user funnels, retention/cohort analysis' },
    { id: 'apple',      name: 'Apple',      emoji: '🍎', focus: 'Clean schema design, transactions, edge cases with NULL' },
    { id: 'microsoft',  name: 'Microsoft',  emoji: '🪟', focus: 'T-SQL, stored procedures, indexes, query tuning' },
    { id: 'netflix',    name: 'Netflix',    emoji: '🎬', focus: 'Sessionization, time-series, A/B test analysis' },
    { id: 'uber',       name: 'Uber',       emoji: '🚗', focus: 'Geospatial joins, surge pricing windows, driver-rider matching' },
    { id: 'airbnb',     name: 'Airbnb',     emoji: '🏡', focus: 'Booking funnels, host metrics, seasonality, calendar gaps' },
    { id: 'stripe',     name: 'Stripe',     emoji: '💳', focus: 'Idempotency, money math, double-entry ledger, fraud signals' },
    { id: 'linkedin',   name: 'LinkedIn',   emoji: '💼', focus: 'Network/connection queries, recursive CTEs, graph traversal' },
    { id: 'salesforce', name: 'Salesforce', emoji: '☁️', focus: 'Multi-tenant data, complex joins, hierarchical orgs' },
    { id: 'goldman',    name: 'Goldman Sachs', emoji: '🏦', focus: 'Window functions on time-series, running balances, risk aggregations' },
    { id: 'jpmorgan',   name: 'JPMorgan',   emoji: '💰', focus: 'Financial reconciliation, audit trails, regulatory queries' },
    { id: 'tcs',        name: 'TCS / Infosys / Wipro', emoji: '🇮🇳', focus: 'Strong fundamentals: joins, normalization, ACID, basic optimization' },
    { id: 'startup',    name: 'Startups',   emoji: '🚀', focus: 'Full-stack SQL — schema design + queries + perf intuition all in one round' }
  ],

  /* ==================== CATEGORIES ==================== */
  categories: [
    { id: 'basics',     label: 'Basics',                   color: '#22d3ee' },
    { id: 'joins',      label: 'Joins',                    color: '#34d399' },
    { id: 'aggregation',label: 'Aggregation',              color: '#fbbf24' },
    { id: 'window',     label: 'Window Functions',         color: '#a78bfa' },
    { id: 'topn',       label: 'Top-N per Group',          color: '#fb7185' },
    { id: 'date',       label: 'Date / Time',              color: '#38bdf8' },
    { id: 'subquery',   label: 'Subqueries / CTEs',        color: '#f472b6' },
    { id: 'string',     label: 'String Manipulation',      color: '#fbbf24' },
    { id: 'schema',     label: 'Schema Design',            color: '#22d3ee' },
    { id: 'perf',       label: 'Performance / Indexes',    color: '#34d399' },
    { id: 'trick',      label: 'Tricky / Gotcha',          color: '#fb7185' },
    { id: 'pattern',    label: 'Patterns & Recipes',       color: '#a78bfa' },
    { id: 'theory',     label: 'Theory (ACID, Normalization)', color: '#fbbf24' }
  ],

  /* ==================== QUESTIONS ==================== */
  questions: [

    /* ---------- BASICS / NULL traps (easy but trip 70% of candidates) ---------- */
    {
      id: 'q001',
      title: 'NULL = NULL — why does this never return true?',
      categories: ['basics', 'trick'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['google', 'meta', 'apple', 'tcs'],
      frequency: 'Very High',
      question:
        "Why does `SELECT * FROM users WHERE manager_id = NULL` return zero rows even when there are rows with NULL manager_id?",
      answer:
        "Because in SQL, comparing **anything** to NULL using `=` returns NULL (which is treated as false), not true. NULL means 'unknown' — and you can't say 'unknown equals unknown'.\n\n**Fix:** use `IS NULL` or `IS NOT NULL`.\n\n```sql\n-- Wrong\nSELECT * FROM users WHERE manager_id = NULL;\n\n-- Right\nSELECT * FROM users WHERE manager_id IS NULL;\n```\n\nThis catches 70% of junior candidates and a surprising number of mid-level ones too.",
      followups: [
        'What does `NULL + 5` evaluate to? (Answer: NULL.)',
        'What does `COUNT(*)` vs `COUNT(column)` return when there are NULLs?',
        'How does `NOT IN` behave with NULL in the subquery? (Hint: it kills the result.)'
      ]
    },

    {
      id: 'q002',
      title: 'COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column)',
      categories: ['basics', 'aggregation', 'trick'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['amazon', 'meta', 'microsoft', 'tcs', 'startup'],
      frequency: 'Very High',
      question:
        "What's the difference between these three queries? Give a scenario where each returns a different number.\n\n```sql\nSELECT COUNT(*) FROM employees;\nSELECT COUNT(manager_id) FROM employees;\nSELECT COUNT(DISTINCT manager_id) FROM employees;\n```",
      answer:
        "- **`COUNT(*)`** counts every row, NULLs included. → 8 rows.\n- **`COUNT(manager_id)`** counts only rows where `manager_id` is NOT NULL. → 5 rows (3 managers have no manager themselves).\n- **`COUNT(DISTINCT manager_id)`** counts unique non-NULL values. → 3 rows (only 3 distinct managers exist).\n\nThis is a classic 'do you actually understand NULL?' question. Many candidates think all three return the same thing.",
      followups: ['What does `SUM(col) / COUNT(*)` give vs `AVG(col)`?']
    },

    {
      id: 'q003',
      title: 'NOT IN with NULL — the silent killer',
      categories: ['trick', 'subquery'],
      difficulty: 'Medium',
      tricky: true,
      companies: ['google', 'amazon', 'stripe', 'goldman'],
      frequency: 'High',
      question:
        "You run:\n```sql\nSELECT * FROM customers\nWHERE customer_id NOT IN (SELECT customer_id FROM orders);\n```\nIt returns 0 rows. You know there should be results. What's happening?",
      answer:
        "If **any** row in the subquery has a NULL `customer_id`, the entire `NOT IN` returns NULL for every row — which means no rows match.\n\nIt's logical: `x NOT IN (1, 2, NULL)` evaluates to `x != 1 AND x != 2 AND x != NULL`. That last `!= NULL` is NULL, which makes the whole AND NULL. So nothing comes back.\n\n**Fixes:**\n```sql\n-- Option 1: Use NOT EXISTS (immune to NULL)\nSELECT * FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);\n\n-- Option 2: Filter NULL in the subquery\nWHERE customer_id NOT IN (\n  SELECT customer_id FROM orders WHERE customer_id IS NOT NULL\n);\n```\n\n**Always prefer `NOT EXISTS` for negative existence checks** — it's both correct with NULLs and usually faster.",
      followups: ['Why is `NOT EXISTS` typically faster than `NOT IN` on large tables?']
    },

    /* ---------- JOINS ---------- */
    {
      id: 'q004',
      title: 'Second highest salary (THE classic SQL interview question)',
      categories: ['joins', 'aggregation', 'window', 'topn'],
      difficulty: 'Medium',
      companies: ['google', 'amazon', 'meta', 'microsoft', 'tcs', 'goldman', 'startup'],
      frequency: 'Extremely High',
      question:
        'Write a query to find the **second-highest** salary from the `employees` table. Handle the case where there is no second-highest salary (return NULL).',
      answer:
        "Four valid approaches — interviewers love seeing more than one:\n\n**1. Window function (modern, cleanest):**\n```sql\nSELECT MAX(salary) AS second_highest\nFROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) ranked\nWHERE rnk = 2;\n```\n\n**2. Subquery with MAX:**\n```sql\nSELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n```\n\n**3. LIMIT + OFFSET (MySQL/Postgres):**\n```sql\nSELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;\n```\n\n**4. Nth-highest generalized:**\n```sql\nWITH ranked AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT salary FROM ranked WHERE rnk = N;\n```\n\n**Gotcha:** `RANK` vs `DENSE_RANK` matters with ties — `DENSE_RANK` is usually what you want for 'Nth distinct salary'.",
      followups: [
        'Modify to find the Nth highest salary.',
        'What if there are ties? Should the second highest be the same value or the next distinct value?'
      ]
    },

    {
      id: 'q005',
      title: 'Department + employee with the highest salary in each',
      categories: ['joins', 'window', 'topn'],
      difficulty: 'Medium',
      companies: ['amazon', 'meta', 'microsoft', 'goldman', 'salesforce'],
      frequency: 'Extremely High',
      question:
        'For each department, return the name and salary of the **highest-paid employee**. Handle ties (return all employees tied for the top).',
      answer:
        "**With window function (best):**\n```sql\nWITH ranked AS (\n  SELECT name, department, salary,\n    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT department, name, salary\nFROM ranked\nWHERE rnk = 1;\n```\n\n**Without window functions (older systems):**\n```sql\nSELECT e.department, e.name, e.salary\nFROM employees e\nJOIN (\n  SELECT department, MAX(salary) AS max_sal\n  FROM employees\n  GROUP BY department\n) m ON e.department = m.department AND e.salary = m.max_sal;\n```\n\n**Why RANK and not ROW_NUMBER:** `ROW_NUMBER` gives unique 1, 2, 3 — so ties get arbitrarily ordered and you lose one. `RANK` (or `DENSE_RANK`) keeps all tied rows at rank 1.",
      followups: ['Now get the top 3 per department.', 'What if you want the *median* salary per department?']
    },

    {
      id: 'q006',
      title: 'Customers who never ordered',
      categories: ['joins', 'subquery'],
      difficulty: 'Easy',
      companies: ['amazon', 'meta', 'airbnb', 'tcs', 'startup'],
      frequency: 'Very High',
      question:
        'Return the names of all customers who have **never placed an order**.',
      answer:
        "Three ways, in order of preference:\n\n**1. NOT EXISTS (cleanest, NULL-safe, fast):**\n```sql\nSELECT name FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);\n```\n\n**2. LEFT JOIN + IS NULL (very common in interviews):**\n```sql\nSELECT c.name\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;\n```\n\n**3. NOT IN (avoid if subquery can have NULL):**\n```sql\nSELECT name FROM customers\nWHERE customer_id NOT IN (\n  SELECT customer_id FROM orders WHERE customer_id IS NOT NULL\n);\n```\n\nShow at least two approaches — interviewers love demonstrating you know the trade-offs.",
      followups: ['Which performs best on a 100M-row orders table, and why?']
    },

    {
      id: 'q007',
      title: 'INNER vs LEFT vs RIGHT vs FULL — when do they matter?',
      categories: ['joins', 'theory'],
      difficulty: 'Easy',
      companies: ['google', 'amazon', 'apple', 'tcs', 'microsoft'],
      frequency: 'Very High',
      question:
        'Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with an example.',
      answer:
        "Given tables A (3 rows) and B (3 rows) with 2 matching pairs:\n\n- **INNER JOIN** → 2 rows (only matches)\n- **LEFT JOIN** → 3 rows (all A, NULLs where B doesn't match)\n- **RIGHT JOIN** → 3 rows (all B, NULLs where A doesn't match)\n- **FULL OUTER JOIN** → 4 rows (everything, NULLs on both sides)\n- **CROSS JOIN** → 9 rows (Cartesian: 3 × 3)\n\nReal-world rule: **RIGHT JOIN is essentially never used** in practice — people swap table order and use LEFT JOIN, which is more readable.\n\n**Gotcha:** MySQL didn't support FULL OUTER JOIN until v8 — interviewers sometimes ask how to simulate it:\n```sql\nSELECT * FROM a LEFT JOIN b ON a.id = b.id\nUNION\nSELECT * FROM a RIGHT JOIN b ON a.id = b.id;\n```",
      followups: ['When would you use a self-join?', 'When does a CROSS JOIN actually make sense?']
    },

    {
      id: 'q008',
      title: 'Employees earning more than their manager',
      categories: ['joins', 'pattern'],
      difficulty: 'Medium',
      companies: ['amazon', 'apple', 'microsoft', 'linkedin'],
      frequency: 'High',
      question:
        "Given an `employees(employee_id, name, salary, manager_id)` table, find every employee earning **more** than their manager.",
      answer:
        "Classic self-join:\n```sql\nSELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.employee_id\nWHERE e.salary > m.salary;\n```\n\n**Why self-join:** the same table plays two roles — `e` is the employee, `m` is the manager. Aliases are mandatory to disambiguate.\n\n**Watch for:** top-level managers have `manager_id = NULL`, so INNER JOIN drops them. That's usually what you want here (they have no manager to compare against), but always state the assumption.",
      followups: ['Now find managers whose entire team out-earns them.']
    },

    /* ---------- AGGREGATION ---------- */
    {
      id: 'q009',
      title: 'Total revenue by month',
      categories: ['aggregation', 'date'],
      difficulty: 'Easy',
      companies: ['amazon', 'meta', 'netflix', 'airbnb', 'stripe', 'tcs'],
      frequency: 'Very High',
      question:
        'Return total revenue per month, ordered chronologically.',
      answer:
        "```sql\n-- PostgreSQL\nSELECT\n  DATE_TRUNC('month', order_date) AS month,\n  SUM(total_amount) AS revenue\nFROM orders\nWHERE status = 'delivered'\nGROUP BY DATE_TRUNC('month', order_date)\nORDER BY month;\n\n-- MySQL\nSELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount)\nFROM orders WHERE status = 'delivered'\nGROUP BY DATE_FORMAT(order_date, '%Y-%m')\nORDER BY month;\n\n-- SQLite\nSELECT strftime('%Y-%m', order_date) AS month, SUM(total_amount)\nFROM orders WHERE status = 'delivered'\nGROUP BY strftime('%Y-%m', order_date)\nORDER BY month;\n```\n\n**Common mistake:** forgetting to filter `status = 'delivered'` — cancelled orders shouldn't count as revenue.",
      followups: ['Now show month-over-month growth %.', 'How would you fill in months with zero revenue?']
    },

    {
      id: 'q010',
      title: 'HAVING vs WHERE — when does it matter?',
      categories: ['aggregation', 'trick'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['google', 'amazon', 'tcs', 'microsoft'],
      frequency: 'Very High',
      question:
        'Can you use `HAVING` without `GROUP BY`? What about `WHERE COUNT(*) > 5` — would that work?',
      answer:
        "**`HAVING` without `GROUP BY`:** yes, in most dialects, but it treats the entire result as one group. Rarely useful.\n\n**`WHERE COUNT(*) > 5`:** ❌ **No.** WHERE runs **before** aggregation, so aggregates don't exist yet at the WHERE stage. You must use HAVING:\n\n```sql\n-- Wrong\nSELECT customer_id FROM orders WHERE COUNT(*) > 5 GROUP BY customer_id;\n\n-- Right\nSELECT customer_id FROM orders GROUP BY customer_id HAVING COUNT(*) > 5;\n```\n\n**Mnemonic:** WHERE filters **rows**, HAVING filters **groups**. Order: `WHERE → GROUP BY → HAVING`.",
      followups: ['Can HAVING reference a column not in SELECT or GROUP BY?']
    },

    /* ---------- WINDOW FUNCTIONS ---------- */
    {
      id: 'q011',
      title: 'Running total of sales',
      categories: ['window', 'pattern'],
      difficulty: 'Medium',
      companies: ['google', 'goldman', 'jpmorgan', 'stripe', 'netflix'],
      frequency: 'Very High',
      question:
        'Show each order with a running total of revenue ordered by date.',
      answer:
        "```sql\nSELECT\n  order_id,\n  order_date,\n  total_amount,\n  SUM(total_amount) OVER (ORDER BY order_date) AS running_total\nFROM orders\nORDER BY order_date;\n```\n\n**Per-customer running total:**\n```sql\nSUM(total_amount) OVER (\n  PARTITION BY customer_id\n  ORDER BY order_date\n) AS customer_running_total\n```\n\n**Trailing 3-row moving average:**\n```sql\nAVG(total_amount) OVER (\n  ORDER BY order_date\n  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n) AS moving_avg\n```\n\nPre-window-function era, this required a correlated subquery or a self-join — both ugly. Windows made this one line.",
      followups: ['What\'s the default window frame when you specify ORDER BY in OVER()?']
    },

    {
      id: 'q012',
      title: 'ROW_NUMBER vs RANK vs DENSE_RANK',
      categories: ['window', 'trick'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['google', 'amazon', 'meta', 'microsoft', 'goldman'],
      frequency: 'Very High',
      question:
        'What output do these three produce on this data?\n```\nsalary: 100, 100, 90, 80\n```',
      answer:
        "Given `ORDER BY salary DESC`:\n\n| salary | ROW_NUMBER | RANK | DENSE_RANK |\n|--------|------------|------|------------|\n| 100    | 1          | 1    | 1          |\n| 100    | 2          | 1    | 1          |\n| 90     | 3          | 3    | 2          |\n| 80     | 4          | 4    | 3          |\n\n- **ROW_NUMBER:** always unique. Ties broken arbitrarily (or by your tiebreaker).\n- **RANK:** ties share a rank, **skips** the next.\n- **DENSE_RANK:** ties share a rank, **doesn't skip**.\n\n**When to use which:**\n- Top N rows regardless of ties → ROW_NUMBER (and accept arbitrary tie-breaking).\n- Top N including ties → RANK or DENSE_RANK.\n- 'Top 3 distinct values' → DENSE_RANK.",
      followups: ['What about NTILE(4)?']
    },

    {
      id: 'q013',
      title: 'Find consecutive rows with the same value (gaps and islands)',
      categories: ['window', 'pattern'],
      difficulty: 'Hard',
      companies: ['google', 'meta', 'netflix', 'uber', 'linkedin'],
      frequency: 'Medium',
      question:
        "Given a `logins(user_id, login_date)` table, find every user's **longest login streak** (consecutive days).",
      answer:
        "Classic 'gaps and islands' problem. The trick: subtract a row number from the date to group consecutive runs.\n\n```sql\nWITH streaks AS (\n  SELECT\n    user_id,\n    login_date,\n    login_date - ROW_NUMBER() OVER (\n      PARTITION BY user_id ORDER BY login_date\n    ) * INTERVAL '1 day' AS streak_group\n  FROM logins\n)\nSELECT\n  user_id,\n  MIN(login_date) AS streak_start,\n  MAX(login_date) AS streak_end,\n  COUNT(*) AS streak_length\nFROM streaks\nGROUP BY user_id, streak_group\nORDER BY user_id, streak_length DESC;\n```\n\n**Why it works:** consecutive dates produce the same `(date - row_number)` value, grouping them together.\n\nIf they ask, mention you can do the same with `LAG` to detect gaps and an accumulating sum. Both work; the date-minus-row-number trick is the elegant one.",
      followups: ['How would you find the user with the longest streak overall?', 'What if logins can be multiple per day?']
    },

    /* ---------- TOP-N PER GROUP ---------- */
    {
      id: 'q014',
      title: 'Top 3 products by revenue per category',
      categories: ['topn', 'window', 'joins'],
      difficulty: 'Medium',
      companies: ['amazon', 'meta', 'netflix', 'airbnb', 'stripe'],
      frequency: 'Very High',
      question:
        'Return the top 3 products by total revenue within each category.',
      answer:
        "```sql\nWITH product_revenue AS (\n  SELECT\n    p.category,\n    p.name,\n    SUM(oi.quantity * oi.unit_price) AS revenue\n  FROM products p\n  JOIN order_items oi ON p.product_id = oi.product_id\n  GROUP BY p.category, p.name\n),\nranked AS (\n  SELECT\n    category, name, revenue,\n    DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rnk\n  FROM product_revenue\n)\nSELECT category, name, revenue\nFROM ranked\nWHERE rnk <= 3\nORDER BY category, rnk;\n```\n\n**Choose DENSE_RANK over ROW_NUMBER** if ties should all count (you'd rather return 4 rows than arbitrarily pick 3).",
      followups: ['Use ROW_NUMBER and explain the difference in result.']
    },

    /* ---------- DATE ---------- */
    {
      id: 'q015',
      title: 'Customers who signed up in the last 30 days',
      categories: ['date', 'basics'],
      difficulty: 'Easy',
      companies: ['amazon', 'netflix', 'airbnb', 'stripe', 'tcs'],
      frequency: 'Very High',
      question:
        'Find all customers who signed up in the **last 30 days**.',
      answer:
        "```sql\n-- PostgreSQL\nSELECT * FROM customers\nWHERE signup_date >= CURRENT_DATE - INTERVAL '30 days';\n\n-- MySQL\nSELECT * FROM customers\nWHERE signup_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);\n\n-- SQLite\nSELECT * FROM customers\nWHERE signup_date >= date('now', '-30 days');\n```\n\n**Anti-pattern alert:** `WHERE DATE(signup_date) >= ...` will **kill any index** on `signup_date` because the function on the column prevents index use. Always compare the column to a computed value, never the other way around.",
      followups: ['How would you find signups in each of the last 12 months?', 'What if signup_date has a time component?']
    },

    {
      id: 'q016',
      title: 'Day-of-week analysis',
      categories: ['date', 'aggregation'],
      difficulty: 'Easy',
      companies: ['amazon', 'meta', 'netflix', 'uber'],
      frequency: 'High',
      question:
        'Which day of the week has the highest average order value?',
      answer:
        "```sql\n-- PostgreSQL\nSELECT\n  TO_CHAR(order_date, 'Day') AS day_of_week,\n  AVG(total_amount) AS avg_order\nFROM orders\nWHERE status = 'delivered'\nGROUP BY TO_CHAR(order_date, 'Day'), EXTRACT(DOW FROM order_date)\nORDER BY avg_order DESC;\n```\n\n**Note** the trick: `GROUP BY` includes `EXTRACT(DOW FROM order_date)` so the ordering is deterministic. Otherwise Monday might come before Sunday depending on locale.",
      followups: ['Now group by hour of day for peak ordering times.']
    },

    /* ---------- SUBQUERY / CTE ---------- */
    {
      id: 'q017',
      title: 'Median salary (no MEDIAN function)',
      categories: ['subquery', 'window', 'trick'],
      difficulty: 'Hard',
      tricky: true,
      companies: ['google', 'meta', 'goldman', 'jpmorgan'],
      frequency: 'Medium',
      question:
        'Most SQL engines don\'t have a MEDIAN function. Compute the median salary using only standard SQL.',
      answer:
        "Several approaches:\n\n**1. Using PERCENTILE_CONT (PostgreSQL):**\n```sql\nSELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median\nFROM employees;\n```\n\n**2. Using window functions (portable):**\n```sql\nWITH ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary) AS rn,\n    COUNT(*) OVER () AS cnt\n  FROM employees\n)\nSELECT AVG(salary) AS median\nFROM ranked\nWHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2);\n```\n\n**Why `AVG`:** for even counts, median is the average of the two middle values. The `IN (...)` trick handles both odd and even cases.\n\n**3. MySQL hack (older versions):**\n```sql\nSELECT AVG(salary) FROM (\n  SELECT salary FROM employees ORDER BY salary\n  LIMIT 2 - (SELECT COUNT(*) FROM employees) % 2\n  OFFSET (SELECT (COUNT(*) - 1) / 2 FROM employees)\n) t;\n```",
      followups: ['How would you compute median per department?']
    },

    {
      id: 'q018',
      title: 'CTE vs subquery vs temp table — when to use which?',
      categories: ['subquery', 'perf', 'theory'],
      difficulty: 'Medium',
      companies: ['amazon', 'microsoft', 'goldman', 'salesforce'],
      frequency: 'High',
      question:
        'Compare CTEs, subqueries, and temp tables. When would you reach for each?',
      answer:
        "**Subqueries:** good for one-shot inline filters. Hard to debug, can\'t be reused in the same query.\n\n**CTEs (WITH):** Named, readable, **reusable** within the same query. Modern optimizers can inline them (PG 12+, MySQL 8+). In older PG (≤11), CTEs were optimization fences — sometimes slow.\n\n**Recursive CTEs:** the only way to do tree/graph traversal in standard SQL.\n\n**Temp tables:** persist for the session. Materialize once, query many times. Use when:\n- You need to query the same intermediate result multiple times\n- The query is huge and the optimizer is making bad choices\n- You want statistics computed on the intermediate result\n\n**Rule of thumb:** start with CTEs for readability. Move to temp tables if you see the optimizer doing redundant work or if you'll reuse the result.",
      followups: ['What\'s an "optimization fence"? Why did it matter for older PostgreSQL CTEs?']
    },

    /* ---------- STRING ---------- */
    {
      id: 'q019',
      title: 'Extract domain from email',
      categories: ['string', 'pattern'],
      difficulty: 'Easy',
      companies: ['google', 'meta', 'linkedin', 'tcs'],
      frequency: 'High',
      question:
        'From a `customers(email)` column, count customers per email domain.',
      answer:
        "```sql\n-- PostgreSQL / SQLite\nSELECT\n  SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain,\n  COUNT(*) AS customers\nFROM customers\nGROUP BY domain\nORDER BY customers DESC;\n\n-- MySQL\nSELECT SUBSTRING_INDEX(email, '@', -1) AS domain, COUNT(*)\nFROM customers GROUP BY domain ORDER BY COUNT(*) DESC;\n```\n\n**Edge cases to mention:**\n- NULLs in email → wrap with COALESCE or filter\n- Invalid emails (no @) → SUBSTRING returns the whole string\n- Case sensitivity → wrap in LOWER()",
      followups: ['Now find the top customer for each domain.']
    },

    {
      id: 'q020',
      title: 'Find duplicate rows',
      categories: ['string', 'aggregation', 'trick'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['amazon', 'apple', 'tcs', 'startup'],
      frequency: 'Very High',
      question:
        'Find all duplicate emails in the `customers` table (return the email and how many times it appears).',
      answer:
        "```sql\nSELECT email, COUNT(*) AS dup_count\nFROM customers\nGROUP BY email\nHAVING COUNT(*) > 1;\n```\n\n**To return all rows that have duplicates (not just one per group):**\n```sql\nSELECT *\nFROM customers\nWHERE email IN (\n  SELECT email FROM customers GROUP BY email HAVING COUNT(*) > 1\n);\n```\n\n**To delete duplicates and keep the lowest ID:**\n```sql\nDELETE FROM customers\nWHERE customer_id NOT IN (\n  SELECT MIN(customer_id) FROM customers GROUP BY email\n);\n```\n\n⚠️ **Don't run DELETE on production without a transaction and a test on a SELECT first.**",
      followups: ['How would you de-duplicate using window functions instead?']
    },

    /* ---------- SCHEMA DESIGN ---------- */
    {
      id: 'q021',
      title: 'Design a schema for Twitter / X',
      categories: ['schema', 'theory'],
      difficulty: 'Hard',
      companies: ['google', 'meta', 'linkedin', 'amazon', 'apple', 'startup'],
      frequency: 'High',
      question:
        'Design a schema for a simplified Twitter: users, tweets, follows, likes, retweets. Justify your decisions.',
      answer:
        "Core tables:\n\n```sql\nusers(user_id PK, handle UNIQUE, name, bio, created_at)\n\ntweets(\n  tweet_id PK, user_id FK,\n  content VARCHAR(280),\n  parent_tweet_id FK NULL,  -- for replies\n  created_at,\n  INDEX (user_id, created_at DESC)  -- profile timeline\n)\n\nfollows(\n  follower_id FK, followee_id FK,\n  created_at,\n  PRIMARY KEY (follower_id, followee_id),\n  INDEX (followee_id, follower_id)  -- reverse lookup\n)\n\nlikes(user_id FK, tweet_id FK, created_at, PRIMARY KEY (user_id, tweet_id))\n\nretweets(user_id FK, tweet_id FK, created_at, PRIMARY KEY (user_id, tweet_id))\n```\n\n**Key design decisions:**\n1. **Composite PK on follows/likes** prevents duplicate relationships and is implicitly indexed.\n2. **Index `(user_id, created_at DESC)`** on tweets serves the profile timeline query in O(log n).\n3. **Replies via `parent_tweet_id`** instead of a separate replies table — simpler, supports trees naturally.\n4. **Denormalize like_count, retweet_count** on the tweets table for hot reads — update via triggers or app code.\n\n**What you'd add for production:** sharding by user_id, a fan-out table for the home timeline (Twitter's famous architecture), caching, rate-limit tables.",
      followups: ['Now write the query for a user\'s home timeline (most recent tweets from people they follow).', 'How would you handle 100M tweets/day?']
    },

    {
      id: 'q022',
      title: 'Normalize this denormalized table',
      categories: ['schema', 'theory'],
      difficulty: 'Medium',
      companies: ['amazon', 'apple', 'microsoft', 'tcs', 'salesforce'],
      frequency: 'High',
      question:
        "An orders table looks like this:\n```\norders(order_id, customer_name, customer_email, customer_city, product_name, product_price, quantity)\n```\nIdentify the normal forms it violates and refactor.",
      answer:
        "**Violations:**\n- **1NF**: passes (atomic values).\n- **2NF**: assuming `(order_id, product_name)` would be a composite key (multi-line orders), `customer_name`/`email`/`city` depend only on `order_id`, not on `product_name`. → **partial dependency** = 2NF violation.\n- **3NF**: `customer_email`, `customer_city` depend on the customer, not on the order. → **transitive dependency** = 3NF violation.\n- **Update anomaly**: changing a customer's city requires updating every one of their orders.\n\n**Normalized version:**\n```sql\ncustomers(customer_id PK, name, email, city)\nproducts(product_id PK, name, price)\norders(order_id PK, customer_id FK, order_date, status)\norder_items(item_id PK, order_id FK, product_id FK, quantity, unit_price)\n```\n\n**Note on `unit_price` in order_items:** we copy the price **at time of order** because the product's current price can change. This is *intentional* denormalization for historical accuracy.",
      followups: ['When would you intentionally denormalize? (Star schemas in analytics.)']
    },

    /* ---------- PERFORMANCE / INDEXES ---------- */
    {
      id: 'q023',
      title: 'Why is my query slow? How would you debug?',
      categories: ['perf'],
      difficulty: 'Medium',
      companies: ['google', 'amazon', 'meta', 'microsoft', 'goldman', 'stripe'],
      frequency: 'Very High',
      question:
        "A query that used to be fast is now slow. Walk me through how you'd diagnose and fix it.",
      answer:
        "Standard playbook:\n\n**1. Get the execution plan**\n```sql\nEXPLAIN ANALYZE SELECT ...\n```\nLook for:\n- **Seq Scan on a large table** → missing index\n- **Nested Loop on big inputs** → bad join strategy, often a stats issue\n- **Rows: actual >> expected** → stale statistics → run `ANALYZE table`\n- **Sort with disk spill** → not enough work_mem, or sort step shouldn't exist\n\n**2. Check the obvious wins**\n- Are columns in WHERE / JOIN / ORDER BY indexed?\n- Is the query using `SELECT *` when it shouldn't?\n- Is there a function on the indexed column? (`WHERE UPPER(email) = ...` defeats the index)\n- Implicit type casting? (`WHERE id_string = 12345` casts every row)\n\n**3. Check if data shape changed**\n- Table grew 100x?\n- New skewed value? (One customer has 50% of all orders.)\n- Statistics out of date?\n\n**4. Last resort**\n- Composite indexes for multi-column filters\n- Partial indexes for hot subsets (`WHERE status = 'active'`)\n- Materialized views for expensive aggregations\n- Partitioning for time-series\n\nAlways measure before and after. Don't add indexes blindly — every index slows writes.",
      followups: ['What\'s the difference between EXPLAIN and EXPLAIN ANALYZE?']
    },

    {
      id: 'q024',
      title: 'When does a composite index help?',
      categories: ['perf'],
      difficulty: 'Medium',
      tricky: true,
      companies: ['google', 'amazon', 'microsoft', 'goldman'],
      frequency: 'High',
      question:
        "You have an index on `(customer_id, order_date)`. Which of these queries can use it?\n```\na) WHERE customer_id = 1\nb) WHERE order_date = '2024-01-01'\nc) WHERE customer_id = 1 AND order_date = '2024-01-01'\nd) WHERE customer_id = 1 ORDER BY order_date DESC\n```",
      answer:
        "**Composite index rule (left-prefix):** the index works **left-to-right**. You can skip trailing columns but not leading ones.\n\n- **a) ✅ Uses index** (matches first column)\n- **b) ❌ Does NOT use index** (skips first column — index unusable)\n- **c) ✅ Uses index** (full match)\n- **d) ✅ Uses index** (first column matches, then in-order sort by second is free)\n\n**Implication:** if you also frequently filter by `order_date` alone, you need a separate index on `order_date`.\n\n**Bonus follow-up:** what about `WHERE customer_id IN (1, 2, 3) AND order_date > '2024-01-01'`? Still uses the composite index — IN is treated as multiple equality checks.",
      followups: ['How does PostgreSQL\'s "Bitmap Index Scan" differ from a regular index scan?']
    },

    {
      id: 'q025',
      title: 'Index everything? Why not?',
      categories: ['perf', 'theory'],
      difficulty: 'Easy',
      companies: ['amazon', 'microsoft', 'tcs', 'apple'],
      frequency: 'Medium',
      question:
        "Why don't we just put an index on every column?",
      answer:
        "Three reasons:\n\n1. **Writes get slower.** Every INSERT/UPDATE/DELETE has to update every index. A table with 10 indexes can have 10x slower writes.\n\n2. **Disk space.** Indexes can easily double the storage size of a table.\n\n3. **The optimizer has to choose.** More indexes = more plan options = sometimes worse plan choice.\n\n**Rule of thumb:**\n- Index columns in `WHERE`, `JOIN`, `ORDER BY`\n- Don't index columns with very low cardinality (e.g., `status` with only 3 values) — a seq scan is usually faster\n- Don't index small tables (<10k rows) — the overhead isn't worth it\n- Primary keys and unique constraints get indexes automatically\n\nFor write-heavy workloads (queues, audit logs), keep indexes to the minimum.",
      followups: ['What\'s a covering index?', 'When would a partial index make sense?']
    },

    /* ---------- TRICKY / GOTCHAS ---------- */
    {
      id: 'q026',
      title: "GROUP BY ordinal — what does GROUP BY 1, 2 mean?",
      categories: ['trick', 'aggregation'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['google', 'amazon', 'meta', 'netflix'],
      frequency: 'Medium',
      question:
        'What does this query do, and is it a good idea?\n```sql\nSELECT category, EXTRACT(YEAR FROM order_date), SUM(total)\nFROM orders\nGROUP BY 1, 2\nORDER BY 3 DESC;\n```',
      answer:
        "`GROUP BY 1, 2` and `ORDER BY 3 DESC` use **positional references** — column #1 and #2 in the SELECT list.\n\n**Pros:** quick to type, avoids repeating long expressions like `EXTRACT(YEAR FROM order_date)`.\n\n**Cons:**\n- Fragile: reorder the SELECT and the query breaks silently.\n- Less readable: you have to count to know what's grouped on.\n- **Banned in many style guides** (Google, Airbnb).\n\n**Preferred:** name columns explicitly or use aliases (PostgreSQL allows `GROUP BY alias`, MySQL too in most contexts, standard SQL technically doesn't):\n```sql\nSELECT category, EXTRACT(YEAR FROM order_date) AS yr, SUM(total)\nFROM orders\nGROUP BY category, yr\nORDER BY SUM(total) DESC;\n```",
      followups: ['Does ORDER BY allow aliases? (Yes, always.) Does GROUP BY? (Standard SQL: no. Most engines: yes.)']
    },

    {
      id: 'q027',
      title: 'Why does my LEFT JOIN behave like an INNER JOIN?',
      categories: ['trick', 'joins'],
      difficulty: 'Medium',
      tricky: true,
      companies: ['google', 'amazon', 'meta', 'stripe'],
      frequency: 'High',
      question:
        "This LEFT JOIN drops the customers with no orders. Why?\n```sql\nSELECT c.name, o.total_amount\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'delivered';\n```",
      answer:
        "**The `WHERE` clause on the right table's column converts the LEFT JOIN into an effective INNER JOIN.**\n\nWhy: LEFT JOIN fills `o.status` with NULL for unmatched rows. Then `WHERE o.status = 'delivered'` filters those NULL rows out. Result: only matched rows survive — same as INNER JOIN.\n\n**Fix:** move the condition into the ON clause:\n```sql\nSELECT c.name, o.total_amount\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\n  AND o.status = 'delivered';\n```\n\nNow unmatched customers stay (with NULL total_amount), and only delivered orders are joined in.\n\n**Rule:** with LEFT JOINs, predicates on the **right table** go in `ON`. Predicates on the **left table** go in `WHERE`.",
      followups: ['What about `WHERE o.status = \'delivered\' OR o.status IS NULL`? Does that fix it?']
    },

    {
      id: 'q028',
      title: 'Integer division silently drops your decimals',
      categories: ['trick'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['google', 'amazon', 'goldman', 'stripe', 'tcs'],
      frequency: 'Medium',
      question:
        "Why does this return 0 in some databases?\n```sql\nSELECT 50 / 100 AS percentage;\n```",
      answer:
        "Integer / Integer = Integer in PostgreSQL, SQL Server, and (sometimes) MySQL. `50 / 100` truncates to `0`.\n\n**Fixes:**\n```sql\n-- Cast one side to decimal\nSELECT 50 * 1.0 / 100;       -- 0.5\nSELECT 50::DECIMAL / 100;    -- 0.5 (PG)\nSELECT CAST(50 AS DECIMAL) / 100;  -- 0.5\n\n-- Or use explicit decimal literal\nSELECT 50.0 / 100;           -- 0.5\n```\n\n**Real-world bug:** computing percentages like `COUNT(*) / total * 100` and getting 0. Always cast at least one operand to a decimal type.",
      followups: ['What about division by zero — what does each DB do?']
    },

    {
      id: 'q029',
      title: "DISTINCT only applies to the columns you select — and a sneaky bug",
      categories: ['trick', 'basics'],
      difficulty: 'Medium',
      tricky: true,
      companies: ['google', 'meta', 'amazon'],
      frequency: 'Medium',
      question:
        "What's wrong with this attempt to get unique customers, including their latest order date?\n```sql\nSELECT DISTINCT customer_id, order_date\nFROM orders\nORDER BY order_date DESC;\n```",
      answer:
        "`DISTINCT` looks at **all selected columns combined**, not just the first one. Adding `order_date` defeats the purpose — every (customer_id, order_date) pair is already unique, so DISTINCT does nothing.\n\n**Correct approach for 'latest order per customer':**\n```sql\nWITH ranked AS (\n  SELECT customer_id, order_date,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, order_date\nFROM ranked\nWHERE rn = 1;\n```\n\nOr with GROUP BY:\n```sql\nSELECT customer_id, MAX(order_date) AS latest_order\nFROM orders\nGROUP BY customer_id;\n```\n\nThe latter is simpler when you only need the date. Use the window-function approach when you need other columns from the latest row (the entire 'latest order' record).",
      followups: ['How would you get the full latest order row (order_id, total, status, etc.) per customer?']
    },

    {
      id: 'q030',
      title: 'Update with JOIN — surprisingly subtle across dialects',
      categories: ['trick', 'pattern'],
      difficulty: 'Medium',
      companies: ['amazon', 'microsoft', 'apple', 'tcs'],
      frequency: 'Medium',
      question:
        "Increase the price of every product in 'Electronics' by 10%, using only data from another table to identify them.",
      answer:
        "Syntax differs **significantly** between dialects.\n\n**PostgreSQL:**\n```sql\nUPDATE products\nSET price = price * 1.1\nFROM categories c\nWHERE products.category_id = c.id AND c.name = 'Electronics';\n```\n\n**MySQL:**\n```sql\nUPDATE products p\nJOIN categories c ON p.category_id = c.id\nSET p.price = p.price * 1.1\nWHERE c.name = 'Electronics';\n```\n\n**SQL Server:**\n```sql\nUPDATE p\nSET p.price = p.price * 1.1\nFROM products p\nJOIN categories c ON p.category_id = c.id\nWHERE c.name = 'Electronics';\n```\n\n**Standard SQL (works almost everywhere):**\n```sql\nUPDATE products\nSET price = price * 1.1\nWHERE category_id IN (SELECT id FROM categories WHERE name = 'Electronics');\n```\n\nAlways wrap in a transaction and run a SELECT version first.",
      followups: ['What about DELETE with JOIN? Same dialect differences.']
    },

    /* ---------- PATTERNS & RECIPES ---------- */
    {
      id: 'q031',
      title: 'Pivot rows to columns (no PIVOT keyword)',
      categories: ['pattern', 'window', 'aggregation'],
      difficulty: 'Hard',
      companies: ['amazon', 'meta', 'microsoft', 'goldman'],
      frequency: 'Medium',
      question:
        'Pivot order count by month into columns: one row per customer, one column per month.',
      answer:
        "Use **conditional aggregation** (the universal SQL pivot pattern):\n\n```sql\nSELECT\n  customer_id,\n  SUM(CASE WHEN EXTRACT(MONTH FROM order_date) = 1 THEN 1 ELSE 0 END) AS jan,\n  SUM(CASE WHEN EXTRACT(MONTH FROM order_date) = 2 THEN 1 ELSE 0 END) AS feb,\n  SUM(CASE WHEN EXTRACT(MONTH FROM order_date) = 3 THEN 1 ELSE 0 END) AS mar\nFROM orders\nGROUP BY customer_id;\n```\n\nWith dollars instead of counts: `SUM(CASE WHEN ... THEN total_amount ELSE 0 END)`.\n\n**SQL Server / Oracle have a `PIVOT` keyword**, but conditional aggregation works everywhere and is more flexible.\n\n**Dynamic pivot** (unknown month list) requires generating the SQL string — usually done in application code, not pure SQL.",
      followups: ['How would you unpivot — turn a wide table back into rows?']
    },

    {
      id: 'q032',
      title: 'Fill in missing dates (calendar table)',
      categories: ['pattern', 'date'],
      difficulty: 'Hard',
      companies: ['netflix', 'uber', 'airbnb', 'amazon'],
      frequency: 'Medium',
      question:
        "You want daily revenue for the last 30 days, including **zero for days with no sales**. Your `orders` table only has rows on days with orders.",
      answer:
        "Generate a calendar series and LEFT JOIN.\n\n**PostgreSQL:**\n```sql\nWITH calendar AS (\n  SELECT generate_series(\n    CURRENT_DATE - INTERVAL '29 days',\n    CURRENT_DATE,\n    INTERVAL '1 day'\n  )::DATE AS day\n)\nSELECT\n  cal.day,\n  COALESCE(SUM(o.total_amount), 0) AS revenue\nFROM calendar cal\nLEFT JOIN orders o ON o.order_date = cal.day AND o.status = 'delivered'\nGROUP BY cal.day\nORDER BY cal.day;\n```\n\n**MySQL** (no generate_series): build a recursive CTE for dates, or maintain a real `calendar` table.\n\n**Key trick:** the LEFT JOIN must be on the calendar table, and `COALESCE` converts NULL sums to 0.\n\nMany analytics teams maintain a permanent `dim_date` calendar table with every date for the next 10 years and useful columns (day_of_week, is_weekend, fiscal_quarter, etc.).",
      followups: ['How would you do this for "every hour in the last 7 days" instead?']
    },

    {
      id: 'q033',
      title: 'Find sessions (group events with gaps > 30 min)',
      categories: ['pattern', 'window'],
      difficulty: 'Hard',
      companies: ['netflix', 'meta', 'uber', 'linkedin', 'google'],
      frequency: 'Medium',
      question:
        'Given an `events(user_id, ts)` table, group events into "sessions" where consecutive events within 30 minutes belong to the same session.',
      answer:
        "Classic **sessionization** pattern. Three steps:\n\n```sql\nWITH gapped AS (\n  SELECT\n    user_id, ts,\n    CASE\n      WHEN ts - LAG(ts) OVER (PARTITION BY user_id ORDER BY ts) > INTERVAL '30 minutes'\n           OR LAG(ts) OVER (PARTITION BY user_id ORDER BY ts) IS NULL\n      THEN 1 ELSE 0\n    END AS new_session\n  FROM events\n),\nsessions AS (\n  SELECT\n    user_id, ts,\n    SUM(new_session) OVER (PARTITION BY user_id ORDER BY ts) AS session_id\n  FROM gapped\n)\nSELECT\n  user_id,\n  session_id,\n  MIN(ts) AS session_start,\n  MAX(ts) AS session_end,\n  COUNT(*) AS event_count\nFROM sessions\nGROUP BY user_id, session_id\nORDER BY user_id, session_start;\n```\n\n**Why it works:** \n1. LAG detects gaps > 30 min, marks them with `new_session = 1`.\n2. The running SUM of `new_session` becomes a monotonically increasing session counter per user.\n3. GROUP BY that counter to collapse each session.\n\nThis pattern shows up constantly at content/streaming companies.",
      followups: ['How would you find the *average* session length per user?']
    },

    {
      id: 'q034',
      title: 'Cohort retention table',
      categories: ['pattern', 'window', 'date'],
      difficulty: 'Hard',
      companies: ['meta', 'netflix', 'airbnb', 'linkedin', 'uber'],
      frequency: 'Medium',
      question:
        'Build a monthly retention table: for users who signed up in month X, what % were still active in month X+1, X+2, …?',
      answer:
        "```sql\nWITH cohorts AS (\n  SELECT\n    user_id,\n    DATE_TRUNC('month', signup_date) AS cohort_month\n  FROM users\n),\nactivity AS (\n  SELECT\n    user_id,\n    DATE_TRUNC('month', activity_date) AS activity_month\n  FROM events\n  GROUP BY user_id, DATE_TRUNC('month', activity_date)\n),\ncohort_activity AS (\n  SELECT\n    c.cohort_month,\n    a.activity_month,\n    EXTRACT(MONTH FROM AGE(a.activity_month, c.cohort_month)) AS months_since_signup,\n    COUNT(DISTINCT c.user_id) AS active_users\n  FROM cohorts c\n  JOIN activity a ON c.user_id = a.user_id\n  WHERE a.activity_month >= c.cohort_month\n  GROUP BY c.cohort_month, a.activity_month\n),\ncohort_sizes AS (\n  SELECT cohort_month, COUNT(*) AS cohort_size FROM cohorts GROUP BY cohort_month\n)\nSELECT\n  ca.cohort_month,\n  ca.months_since_signup,\n  ca.active_users,\n  cs.cohort_size,\n  ROUND(100.0 * ca.active_users / cs.cohort_size, 1) AS retention_pct\nFROM cohort_activity ca\nJOIN cohort_sizes cs ON ca.cohort_month = cs.cohort_month\nORDER BY ca.cohort_month, ca.months_since_signup;\n```\n\nPivot the final result by `months_since_signup` (using the conditional-aggregation pivot trick) to get the classic retention triangle.",
      followups: ['How would you compute *weekly* retention?']
    },

    /* ---------- THEORY ---------- */
    {
      id: 'q035',
      title: 'Explain ACID properties',
      categories: ['theory'],
      difficulty: 'Easy',
      companies: ['amazon', 'apple', 'microsoft', 'goldman', 'jpmorgan', 'tcs'],
      frequency: 'Very High',
      question:
        'What does ACID stand for? Give a one-sentence explanation of each.',
      answer:
        "**A**tomicity — a transaction is all-or-nothing. Half-applied transactions never happen.\n\n**C**onsistency — every transaction takes the database from one valid state to another (constraints, FKs, triggers).\n\n**I**solation — concurrent transactions don't see each other's in-progress changes (configurable via isolation levels).\n\n**D**urability — once a transaction is committed, it survives crashes (typically via WAL — write-ahead log).\n\n**Common follow-up:** 'What about BASE?' — BASE (Basically Available, Soft state, Eventually consistent) is the NoSQL trade-off: accept temporary inconsistency for scale.\n\n**Trickier follow-up:** 'Isolation levels?' — READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE. Each level prevents more anomalies (dirty reads, non-repeatable reads, phantoms) at the cost of concurrency.",
      followups: ['What anomalies does each isolation level prevent?', 'What\'s a "phantom read"?']
    },

    {
      id: 'q036',
      title: 'Primary key vs Unique vs Foreign key',
      categories: ['theory', 'schema'],
      difficulty: 'Easy',
      companies: ['amazon', 'apple', 'tcs', 'microsoft', 'startup'],
      frequency: 'High',
      question:
        'What are the differences between a primary key, a unique constraint, and a foreign key?',
      answer:
        "**Primary key:**\n- Uniquely identifies each row\n- Cannot be NULL\n- One per table\n- Automatically indexed\n\n**Unique constraint:**\n- Each value is unique across the column(s)\n- **Can be NULL** (and multiple NULLs are allowed in most engines — NULL ≠ NULL!)\n- Can have many per table\n- Automatically indexed\n\n**Foreign key:**\n- References a column (usually a PK) in another table\n- Enforces referential integrity (no orphan references)\n- Can be NULL (unless declared NOT NULL)\n- **Not automatically indexed** — you usually want to add one\n\n**Common gotcha:** people assume a unique constraint blocks duplicates including NULLs. It doesn't — `UNIQUE` on (email) allows multiple rows with NULL email in most DBs.",
      followups: ['What\'s the difference between ON DELETE CASCADE, SET NULL, and RESTRICT?']
    },

    {
      id: 'q037',
      title: 'Difference between DELETE, TRUNCATE, and DROP',
      categories: ['theory', 'basics'],
      difficulty: 'Easy',
      tricky: true,
      companies: ['amazon', 'apple', 'tcs', 'microsoft', 'startup', 'salesforce'],
      frequency: 'Very High',
      question:
        'Compare DELETE, TRUNCATE, and DROP. When would you use each?',
      answer:
        "| Operation | What it does | Rollback? | Triggers? | Speed | Affects schema? |\n|-----------|--------------|-----------|-----------|-------|----------------|\n| **DELETE** | Removes rows | ✅ Yes | ✅ Fires | Slow (row-by-row, logged) | No |\n| **TRUNCATE** | Removes all rows | ⚠️ Depends (PG yes, MySQL no) | ❌ Doesn't fire | Fast (deallocates pages) | No |\n| **DROP** | Removes the entire table | ✅ Yes (in transaction, PG) | N/A | Fast | ✅ Yes |\n\n**TRUNCATE specifics:**\n- Resets auto-increment counter (usually)\n- Can't be used with WHERE\n- Requires higher privileges\n- May not respect foreign keys (PG requires CASCADE)\n\n**Rule of thumb:**\n- A few rows → DELETE\n- All rows, table stays → TRUNCATE\n- Table is going away forever → DROP\n\n⚠️ **Always** test destructive ops on a transaction with a ROLLBACK first.",
      followups: ['Why is TRUNCATE faster than DELETE?', 'Can you DELETE with a JOIN?']
    },

    {
      id: 'q038',
      title: 'OLTP vs OLAP',
      categories: ['theory', 'schema'],
      difficulty: 'Medium',
      companies: ['amazon', 'microsoft', 'goldman', 'salesforce', 'netflix'],
      frequency: 'High',
      question:
        "What's the difference between OLTP and OLAP, and how do their database designs differ?",
      answer:
        "**OLTP (Online Transaction Processing):**\n- Workload: many small reads/writes (single-row operations)\n- Examples: e-commerce checkout, banking, social media posts\n- Schema: **highly normalized** (3NF) to minimize redundancy and update anomalies\n- Optimized for: low latency per transaction, ACID guarantees\n- Tech: PostgreSQL, MySQL, SQL Server\n\n**OLAP (Online Analytical Processing):**\n- Workload: few large reads (aggregations over millions of rows)\n- Examples: dashboards, BI tools, reporting\n- Schema: **denormalized** (star or snowflake schema with fact + dimension tables)\n- Optimized for: throughput on big scans, columnar storage\n- Tech: Snowflake, BigQuery, Redshift, ClickHouse, DuckDB\n\n**Key denormalization in OLAP:** you accept update complexity in exchange for read speed. Loading is batch (nightly ETL), not real-time, so updates aren't the bottleneck.\n\n**Modern trend:** HTAP (Hybrid Transactional/Analytical Processing) — systems like SingleStore and TiDB try to serve both workloads.",
      followups: ['What\'s a star schema? What\'s a fact table?']
    },

    /* ---------- LeetCode classics ---------- */
    {
      id: 'q039',
      title: 'Find the trips and users (LeetCode-style)',
      categories: ['joins', 'aggregation', 'pattern'],
      difficulty: 'Hard',
      companies: ['uber', 'airbnb', 'meta', 'amazon'],
      frequency: 'Medium',
      question:
        'Given `trips(id, client_id, driver_id, status, request_at)` and `users(users_id, banned)`, find the cancellation rate of requests for each day where the **cancellation rate is over 5%**. Exclude trips with banned client or driver.',
      answer:
        "```sql\nSELECT\n  request_at AS day,\n  ROUND(\n    SUM(CASE WHEN status LIKE 'cancelled%' THEN 1 ELSE 0 END) * 1.0 / COUNT(*),\n    2\n  ) AS cancellation_rate\nFROM trips t\nWHERE t.client_id NOT IN (SELECT users_id FROM users WHERE banned = 'Yes')\n  AND t.driver_id NOT IN (SELECT users_id FROM users WHERE banned = 'Yes')\n  AND request_at BETWEEN '2013-10-01' AND '2013-10-03'\nGROUP BY request_at\nHAVING SUM(CASE WHEN status LIKE 'cancelled%' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) > 0.05;\n```\n\n**Why conditional aggregation:** counts cancellations within the same single pass that counts all trips. No second query needed.\n\n**Watch for:** `* 1.0` to avoid integer division.\n\nThis is verbatim a LeetCode Hard SQL question Uber/Lyft love.",
      followups: ['How would you optimize this for 100M trips/day?']
    },

    {
      id: 'q040',
      title: 'Department top three salaries (LeetCode #185)',
      categories: ['window', 'topn'],
      difficulty: 'Hard',
      companies: ['amazon', 'google', 'meta', 'microsoft', 'startup'],
      frequency: 'Very High',
      question:
        'Return all employees who earn one of the top three unique salaries in their department, along with department name and salary.',
      answer:
        "```sql\nWITH ranked AS (\n  SELECT\n    e.name AS employee,\n    e.salary,\n    d.name AS department,\n    DENSE_RANK() OVER (PARTITION BY d.id ORDER BY e.salary DESC) AS rnk\n  FROM employees e\n  JOIN departments d ON e.department_id = d.id\n)\nSELECT department, employee, salary\nFROM ranked\nWHERE rnk <= 3\nORDER BY department, salary DESC;\n```\n\n**Why DENSE_RANK and not RANK or ROW_NUMBER:**\n- ROW_NUMBER would arbitrarily exclude tied salaries\n- RANK would also count toward the 3 with skips (`1, 2, 2, 4` — would include rank 4)\n- DENSE_RANK gives 'top 3 distinct salaries' — usually what 'top three salaries' means in this problem\n\nDiscussing the difference between these three window functions in your answer almost always wins points.",
      followups: ['What if you needed top 3 unique salaries across the *whole* company?']
    }
  ],

  /* ==================== TRICKY-BUT-EASY (highlighted set) ==================== */
  // These are pulled by id and given a special section. All are also in `questions`.
  tricky: ['q001', 'q002', 'q003', 'q010', 'q012', 'q026', 'q027', 'q028', 'q029', 'q037', 'q020']
};
