/* ============================================
   SQLSENSEI — Lesson Content (info + practice)
   No quiz, no validation, no chat. Just content
   and practice queries the student can run in
   the playground.
   ============================================ */

window.LESSONS = {

  /* ==================== LEVEL 1 ==================== */

  '1.1': {
    title: 'What is a database?',
    lead: 'Before we write any SQL, you need to know what we are writing against. A database is a structured store of related information, organized into tables.',
    sections: [
      {
        title: 'Core concepts',
        body: `
          <p>Every database is made up of <strong>tables</strong>. Each table is a grid of data with:</p>
          <ul>
            <li><strong>Columns</strong> — define what kind of data is stored (name, age, price)</li>
            <li><strong>Rows</strong> — individual records (one customer, one product, one order)</li>
            <li><strong>Data types</strong> — constraints on what each column can hold (INT, VARCHAR, DATE, DECIMAL)</li>
            <li><strong>Primary key</strong> — a column that uniquely identifies each row</li>
          </ul>
        `
      },
      {
        title: 'The dataset we will use throughout',
        body: `<p>Every example on this site uses the same 5-table e-commerce dataset. Get familiar with it — by Level 3 you will know these tables by heart.</p>`,
        showTable: 'customers'
      }
    ],
    insight: 'A table is like a strict spreadsheet — every row in a column must match the declared type. That strictness is what makes SQL fast and reliable.',
    practice: [
      { prompt: 'Look at the customers table. What is the primary key column?', solution: 'customer_id (INT) — it uniquely identifies each customer.' },
      { prompt: 'How many columns does the customers table have? What are their data types?', solution: '6 columns: customer_id (INT), name (VARCHAR), email (VARCHAR), city (VARCHAR), signup_date (DATE), age (INT)' }
    ],
    takeaways: [
      'Databases store data in <strong>tables</strong> made of <strong>rows</strong> and <strong>columns</strong>.',
      'Every column has a <strong>data type</strong> that constrains what can go in it.',
      'A <strong>primary key</strong> uniquely identifies each row in a table.'
    ]
  },

  '1.2': {
    title: 'Your first SELECT',
    lead: 'SELECT is how you read data from a table. It is the most important keyword in SQL — you will write it a thousand times before you write anything else.',
    sections: [
      {
        title: 'Basic syntax',
        body: `<p>The simplest SELECT is <code>SELECT &lt;columns&gt; FROM &lt;table&gt;;</code>. Use <code>*</code> to get every column, or list specific columns separated by commas.</p>`
      },
      {
        title: 'Examples',
        examples: [
          { sql: '-- Get all columns for every customer\nSELECT * FROM customers;' },
          { sql: '-- Get just two columns\nSELECT name, city FROM customers;' },
          { sql: '-- Order matters — output columns appear in the order you list them\nSELECT email, name FROM customers;' }
        ]
      }
    ],
    insight: 'Prefer named columns over SELECT * in production code — it makes queries faster, more explicit, and resilient to table changes.',
    practice: [
      { prompt: 'Write a query that retrieves only the <code>name</code> and <code>age</code> columns from the customers table.', solution: 'SELECT name, age FROM customers;' },
      { prompt: 'Write a query that returns all columns from the <code>products</code> table.', solution: 'SELECT * FROM products;' },
      { prompt: 'Return the <code>email</code> and <code>signup_date</code> from customers.', solution: 'SELECT email, signup_date FROM customers;' }
    ],
    takeaways: [
      'Use <code>SELECT col1, col2 FROM table</code> to retrieve specific columns.',
      '<code>SELECT *</code> returns everything — convenient but slower and less safe.',
      'Every SQL statement ends with a semicolon <code>;</code>.'
    ]
  },

  '1.3': {
    title: 'WHERE clause — filtering rows',
    lead: 'SELECT returns every row. WHERE lets you filter to just the rows you care about.',
    sections: [
      {
        title: 'Operators',
        body: `
          <p>Comparison: <code>=</code>, <code>!=</code> (or <code>&lt;&gt;</code>), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code></p>
          <p>Logical: <code>AND</code>, <code>OR</code>, <code>NOT</code></p>
          <p>Membership: <code>IN</code>, <code>BETWEEN</code>, <code>LIKE</code> (with <code>%</code> wildcard)</p>
          <p>NULL: <code>IS NULL</code>, <code>IS NOT NULL</code> — never use <code>= NULL</code></p>
          <p>Text values go in single quotes: <code>city = 'Mumbai'</code></p>
        `
      },
      {
        title: 'Examples',
        examples: [
          { sql: "-- Customers in Mumbai\nSELECT name, city FROM customers WHERE city = 'Mumbai';" },
          { sql: '-- Customers over 30\nSELECT name, age FROM customers WHERE age > 30;' },
          { sql: "-- Combined conditions\nSELECT name FROM customers WHERE city = 'Mumbai' AND age > 25;" },
          { sql: "-- IN clause\nSELECT name FROM customers WHERE city IN ('Mumbai', 'Delhi', 'Tokyo');" },
          { sql: "-- LIKE with wildcard\nSELECT name FROM customers WHERE email LIKE '%@mail.com';" },
          { sql: "-- BETWEEN\nSELECT name FROM customers WHERE age BETWEEN 25 AND 40;" }
        ]
      }
    ],
    insight: 'A common beginner mistake: using <code>=</code> to check for NULL. NEVER works. Always use <code>IS NULL</code> or <code>IS NOT NULL</code>.',
    practice: [
      { prompt: 'Return the <code>name</code> and <code>age</code> of all customers aged 30 or older.', solution: 'SELECT name, age FROM customers WHERE age >= 30;' },
      { prompt: 'Return all products that cost less than $30.', solution: 'SELECT name, price FROM products WHERE price < 30;' },
      { prompt: 'Return customers from either Mumbai or Delhi.', solution: "SELECT name, city FROM customers WHERE city IN ('Mumbai', 'Delhi');" },
      { prompt: 'Find all orders with status "delivered" and total_amount over $100.', solution: "SELECT * FROM orders WHERE status = 'delivered' AND total_amount > 100;" }
    ],
    takeaways: [
      '<code>WHERE</code> filters rows based on a condition.',
      'Combine conditions with <code>AND</code>, <code>OR</code>, <code>NOT</code>.',
      'Text comparisons use single quotes; NULL needs <code>IS NULL</code>.'
    ]
  },

  '1.4': {
    title: 'ORDER BY and LIMIT',
    lead: 'Sort your results, then take just the top N. Together these two clauses solve every "top N" question you will ever get.',
    sections: [
      {
        title: 'Syntax',
        body: `
          <p><code>ORDER BY column ASC|DESC</code> — sort ascending (default) or descending</p>
          <p><code>LIMIT n</code> — return at most n rows</p>
          <p><code>LIMIT n OFFSET m</code> — skip m rows, then return n</p>
          <p><strong>Clause order is fixed:</strong> SELECT → FROM → WHERE → ORDER BY → LIMIT</p>
        `
      },
      {
        title: 'Examples',
        examples: [
          { sql: '-- Top 3 oldest customers\nSELECT name, age FROM customers ORDER BY age DESC LIMIT 3;' },
          { sql: '-- Cheapest 5 products\nSELECT name, price FROM products ORDER BY price ASC LIMIT 5;' },
          { sql: '-- Multi-column sort\nSELECT name, city, age FROM customers ORDER BY city ASC, age DESC;' },
          { sql: '-- Pagination (page 2, 5 per page)\nSELECT * FROM customers ORDER BY customer_id LIMIT 5 OFFSET 5;' }
        ]
      }
    ],
    insight: 'Get the clause order wrong and SQL will refuse to run. Remember: <code>SELECT → FROM → WHERE → ORDER BY → LIMIT</code>.',
    practice: [
      { prompt: 'Return the 5 most recently signed-up customers (name + signup_date).', solution: 'SELECT name, signup_date FROM customers ORDER BY signup_date DESC LIMIT 5;' },
      { prompt: 'Return the 3 most expensive products.', solution: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 3;' },
      { prompt: 'Return customers sorted alphabetically by name.', solution: 'SELECT * FROM customers ORDER BY name ASC;' },
      { prompt: 'Get the 2 oldest customers from the city of Tokyo.', solution: "SELECT name, age FROM customers WHERE city = 'Tokyo' ORDER BY age DESC LIMIT 2;" }
    ],
    takeaways: [
      '<code>ORDER BY column DESC</code> sorts highest-to-lowest.',
      '<code>LIMIT n</code> returns at most n rows.',
      'Clause order: SELECT → FROM → WHERE → ORDER BY → LIMIT.'
    ]
  },

  '1.5': {
    title: 'DISTINCT and NULL',
    lead: 'Two small concepts that catch every beginner: deduplicating with DISTINCT, and the cursed behavior of NULL.',
    sections: [
      {
        title: 'DISTINCT',
        body: `<p><code>SELECT DISTINCT col</code> removes duplicate values from your results. It looks at every selected column combined.</p>`,
        examples: [
          { sql: '-- Unique cities we serve\nSELECT DISTINCT city FROM customers ORDER BY city;' },
          { sql: '-- DISTINCT applies to ALL selected columns combined\nSELECT DISTINCT city, age FROM customers;' }
        ]
      },
      {
        title: 'NULL — the absence of a value',
        body: `<p>NULL means "unknown" or "no value". It is NOT zero, NOT an empty string, and NOT comparable with <code>=</code>.</p>`,
        examples: [
          { sql: '-- Wrong — returns zero rows\nSELECT name FROM employees WHERE manager_id = NULL;' },
          { sql: '-- Right\nSELECT name FROM employees WHERE manager_id IS NULL;' },
          { sql: '-- Find rows that DO have a value\nSELECT name FROM employees WHERE manager_id IS NOT NULL;' }
        ]
      }
    ],
    insight: 'NULL is contagious. <code>NULL + 1</code> is NULL. <code>NULL = NULL</code> is also NULL (not true!). Anything that touches NULL becomes NULL.',
    practice: [
      { prompt: 'List every unique product <code>category</code> we sell.', solution: 'SELECT DISTINCT category FROM products;' },
      { prompt: 'Find every employee who does NOT have a manager.', solution: 'SELECT name FROM employees WHERE manager_id IS NULL;' },
      { prompt: 'Count the number of unique cities customers come from.', solution: 'SELECT COUNT(DISTINCT city) FROM customers;' }
    ],
    takeaways: [
      '<code>SELECT DISTINCT</code> strips duplicate values from your result.',
      'NULL means "unknown" — use <code>IS NULL</code> / <code>IS NOT NULL</code>, never <code>= NULL</code>.',
      'NULL is contagious: any expression touching NULL becomes NULL.'
    ]
  },

  /* ==================== LEVEL 2 ==================== */

  '2.1': {
    title: 'Aggregate functions',
    lead: 'Aggregate functions collapse many rows into a single value. The big five: COUNT, SUM, AVG, MIN, MAX.',
    sections: [
      {
        title: 'The five aggregates',
        body: `
          <ul>
            <li><code>COUNT(*)</code> — count all rows (including NULLs)</li>
            <li><code>COUNT(col)</code> — count rows where col is NOT NULL</li>
            <li><code>COUNT(DISTINCT col)</code> — count unique non-NULL values</li>
            <li><code>SUM(col)</code> — add up all values (ignores NULL)</li>
            <li><code>AVG(col)</code> — average of values (ignores NULL)</li>
            <li><code>MIN(col)</code>, <code>MAX(col)</code> — smallest, largest</li>
          </ul>
        `,
        examples: [
          { sql: '-- Total revenue and average order value\nSELECT\n  COUNT(*) AS total_orders,\n  SUM(total_amount) AS revenue,\n  AVG(total_amount) AS avg_order,\n  MIN(total_amount) AS smallest,\n  MAX(total_amount) AS biggest\nFROM orders;' }
        ]
      }
    ],
    insight: '<code>COUNT(*)</code> counts all rows. <code>COUNT(column)</code> counts only non-NULL values in that column. Pick deliberately.',
    practice: [
      { prompt: 'Return the highest and lowest prices in products (as max_price and min_price).', solution: 'SELECT MAX(price) AS max_price, MIN(price) AS min_price FROM products;' },
      { prompt: 'How many customers are in the database?', solution: 'SELECT COUNT(*) FROM customers;' },
      { prompt: 'What is the total revenue from delivered orders only?', solution: "SELECT SUM(total_amount) AS revenue FROM orders WHERE status = 'delivered';" },
      { prompt: 'What is the average product price?', solution: 'SELECT AVG(price) AS avg_price FROM products;' }
    ],
    takeaways: [
      'Aggregates collapse rows: COUNT, SUM, AVG, MIN, MAX.',
      '<code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> counts non-NULL values.',
      'Aggregates silently ignore NULL — sometimes a gift, sometimes a trap.'
    ]
  },

  '2.2': {
    title: 'GROUP BY',
    lead: 'GROUP BY splits rows into buckets, then runs aggregates per bucket. This is where SQL becomes powerful.',
    sections: [
      {
        title: 'How GROUP BY works',
        body: `
          <p>Pick a column to group by. SQL collapses all rows with the same value into one "group". Then aggregates run per group, not across the whole table.</p>
          <p><strong>The rule:</strong> every column in SELECT must either be <strong>inside an aggregate</strong> or <strong>inside GROUP BY</strong>. No exceptions.</p>
        `,
        examples: [
          { sql: '-- Total spent per customer\nSELECT customer_id, COUNT(*) AS order_count, SUM(total_amount) AS total_spent\nFROM orders\nGROUP BY customer_id\nORDER BY total_spent DESC;' },
          { sql: '-- Products per category\nSELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price\nFROM products\nGROUP BY category;' }
        ]
      }
    ],
    insight: 'Mnemonic: every column in SELECT must either be inside an aggregate OR inside GROUP BY. No exceptions.',
    practice: [
      { prompt: 'Show how many products are in each category.', solution: 'SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;' },
      { prompt: 'For each customer, show their total order count and total spent.', solution: 'SELECT customer_id, COUNT(*) AS orders, SUM(total_amount) AS total FROM orders GROUP BY customer_id;' },
      { prompt: 'Find the average salary per department in employees.', solution: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department;' }
    ],
    takeaways: [
      '<code>GROUP BY col</code> runs aggregates per unique value of col.',
      'Every non-aggregated SELECT column must appear in GROUP BY.',
      'GROUP BY is the bridge between row-level data and summary insights.'
    ]
  },

  '2.3': {
    title: 'HAVING',
    lead: 'WHERE filters rows before grouping. HAVING filters groups after aggregation. Get this distinction wrong and your query breaks.',
    sections: [
      {
        title: 'WHERE vs HAVING',
        body: `
          <p><code>WHERE</code> runs <strong>before</strong> grouping — filters individual rows. You CANNOT use aggregates here.</p>
          <p><code>HAVING</code> runs <strong>after</strong> grouping — filters groups. You CAN use aggregates here.</p>
          <p><strong>Rule of thumb:</strong> if your filter involves an aggregate (SUM, COUNT, etc.), use HAVING. Otherwise use WHERE.</p>
        `,
        examples: [
          { sql: '-- Customers who spent over $100 in total\nSELECT customer_id, SUM(total_amount) AS spent\nFROM orders\nGROUP BY customer_id\nHAVING SUM(total_amount) > 100;' },
          { sql: '-- Categories with more than 1 product\nSELECT category, COUNT(*) AS n\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 1;' }
        ]
      }
    ],
    insight: 'Clause order: <code>WHERE → GROUP BY → HAVING → ORDER BY</code>. Get it wrong and the query refuses to run.',
    practice: [
      { prompt: 'Find product_ids that appear in more than 1 order. Show product_id and the count.', solution: 'SELECT product_id, COUNT(*) AS times FROM order_items GROUP BY product_id HAVING COUNT(*) > 1;' },
      { prompt: 'Find departments with average salary above $90,000.', solution: 'SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 90000;' },
      { prompt: 'Find cities with more than 1 customer.', solution: 'SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 1;' }
    ],
    takeaways: [
      '<code>WHERE</code> filters individual rows; <code>HAVING</code> filters groups.',
      'Aggregates work in HAVING but never in WHERE.',
      'Clause order: WHERE → GROUP BY → HAVING → ORDER BY.'
    ]
  },

  '2.4': {
    title: 'Aliases (AS)',
    lead: 'Rename columns and tables in your output for readability and shorter syntax.',
    sections: [
      {
        title: 'Column and table aliases',
        body: `<p>Use <code>AS</code> to give columns or tables a different name in your output. The <code>AS</code> keyword is optional in most dialects but improves readability.</p>`,
        examples: [
          { sql: '-- Friendly column names\nSELECT name AS customer_name, city AS location, age AS years_old\nFROM customers;' },
          { sql: '-- Table alias\nSELECT c.name, c.city FROM customers AS c WHERE c.age > 30;' },
          { sql: '-- Aliasing aggregates makes output readable\nSELECT category, COUNT(*) AS num_products, AVG(price) AS avg_price\nFROM products GROUP BY category;' }
        ]
      }
    ],
    insight: 'Table aliases (<code>c</code> for customers) become essential the moment you start joining tables. Use them everywhere.',
    practice: [
      { prompt: 'Return each product\'s <code>name</code> as <code>product_name</code> and <code>price</code> as <code>usd</code>.', solution: 'SELECT name AS product_name, price AS usd FROM products;' },
      { prompt: 'Count customers per city, alias the count as <code>customer_count</code>.', solution: 'SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city;' }
    ],
    takeaways: [
      'Column aliases (AS) make results readable.',
      'Table aliases shorten queries, mandatory for joins.',
      'Aliases live only in the query — they do not change the actual schema.'
    ]
  },

  '2.5': {
    title: 'String functions',
    lead: 'Transform text: change case, extract substrings, glue strings together, get length.',
    sections: [
      {
        title: 'The common string functions',
        body: `
          <ul>
            <li><code>UPPER(s)</code>, <code>LOWER(s)</code> — change case</li>
            <li><code>LENGTH(s)</code> — character count</li>
            <li><code>CONCAT(a, b)</code> — glue together (or <code>a || b</code> in PG/SQLite)</li>
            <li><code>SUBSTRING(s, start, len)</code> — extract a slice</li>
            <li><code>TRIM(s)</code> — strip whitespace</li>
            <li><code>REPLACE(s, old, new)</code> — find and replace</li>
          </ul>
        `,
        examples: [
          { sql: "-- Build a label\nSELECT UPPER(name) AS shouty, name || ' (' || city || ')' AS label\nFROM customers LIMIT 4;" },
          { sql: "-- Email domain extraction\nSELECT email, SUBSTR(email, INSTR(email, '@') + 1) AS domain\nFROM customers;" }
        ]
      }
    ],
    insight: '<strong>Dialect alert:</strong> MySQL uses <code>CONCAT(a, b)</code>. PostgreSQL/SQLite support <code>a || b</code>. Use the right one or your query breaks.',
    practice: [
      { prompt: 'Return each customer\'s name and their email in lowercase as <code>email_lower</code>.', solution: 'SELECT name, LOWER(email) AS email_lower FROM customers;' },
      { prompt: 'Return product names in UPPERCASE.', solution: 'SELECT UPPER(name) AS name FROM products;' },
      { prompt: 'Find the length of each customer\'s name.', solution: 'SELECT name, LENGTH(name) AS name_length FROM customers;' }
    ],
    takeaways: [
      'Common string ops: UPPER, LOWER, LENGTH, CONCAT, SUBSTRING.',
      'Dialect differences are real — <code>CONCAT</code> vs <code>||</code> is the classic gotcha.',
      'String functions are pure: they never modify the stored data.'
    ]
  },

  '2.6': {
    title: 'Date functions',
    lead: 'Extract parts of dates, compute differences, format output. Dates are the most dialect-divergent area in all of SQL.',
    sections: [
      {
        title: 'Common operations',
        body: `
          <p><strong>Current time:</strong> <code>CURRENT_DATE</code>, <code>NOW()</code>, <code>CURRENT_TIMESTAMP</code></p>
          <p><strong>Extract parts:</strong></p>
          <ul>
            <li>PostgreSQL: <code>EXTRACT(YEAR FROM date)</code> or <code>DATE_PART('year', date)</code></li>
            <li>MySQL: <code>YEAR(date)</code>, <code>MONTH(date)</code></li>
            <li>SQLite: <code>strftime('%Y', date)</code></li>
          </ul>
          <p><strong>Date diff (days):</strong></p>
          <ul>
            <li>PG: <code>date1 - date2</code></li>
            <li>MySQL: <code>DATEDIFF(d1, d2)</code></li>
            <li>SQLite: <code>julianday(d1) - julianday(d2)</code></li>
          </ul>
        `,
        examples: [
          { sql: "-- Days since signup (SQLite)\nSELECT name, signup_date, julianday('now') - julianday(signup_date) AS days_active\nFROM customers ORDER BY days_active DESC LIMIT 5;" },
          { sql: "-- Signups per year\nSELECT strftime('%Y', signup_date) AS year, COUNT(*) AS signups\nFROM customers GROUP BY year;" }
        ]
      }
    ],
    insight: 'Date dialect differences are biggest in SQL. Always check the docs for your engine — code that works in MySQL may not work in Postgres.',
    practice: [
      { prompt: "Group customers by signup year. Show year and count.", solution: "SELECT strftime('%Y', signup_date) AS year, COUNT(*) AS signups FROM customers GROUP BY year;" },
      { prompt: 'Find orders placed in 2024.', solution: "SELECT * FROM orders WHERE strftime('%Y', order_date) = '2024';" }
    ],
    takeaways: [
      'Dates are first-class types — use date functions, never string parsing.',
      'EXTRACT, DATE_PART, DATEDIFF are common building blocks.',
      'Dialect differences are biggest with dates — always check the docs.'
    ]
  },

  /* ==================== LEVEL 3 ==================== */

  '3.1': {
    title: 'What is a JOIN?',
    lead: 'JOINs combine rows from two tables based on a related column. This is where SQL stops being spreadsheet stuff.',
    sections: [
      {
        title: 'The intuition',
        body: `
          <p>Imagine two Venn circles. The intersection is rows that match in both tables. Different join types control which non-matching rows you keep.</p>
          <ul>
            <li><strong>INNER JOIN</strong> — only the intersection (matching rows)</li>
            <li><strong>LEFT JOIN</strong> — everything from left + matching from right</li>
            <li><strong>RIGHT JOIN</strong> — everything from right + matching from left</li>
            <li><strong>FULL OUTER JOIN</strong> — everything from both, NULLs where no match</li>
            <li><strong>CROSS JOIN</strong> — every combination (Cartesian product)</li>
          </ul>
          <p>The <code>ON</code> clause specifies the matching condition.</p>
        `,
        examples: [
          { sql: '-- Customers and their orders matched by customer_id\nSELECT c.name, o.order_id, o.total_amount\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nLIMIT 5;' }
        ]
      }
    ],
    insight: 'Without ON, you get a Cartesian product — every row in A paired with every row in B. Disaster on big tables.',
    practice: [
      { prompt: 'Join orders to order_items. Show order_id, product_id, and quantity.', solution: 'SELECT o.order_id, oi.product_id, oi.quantity FROM orders o JOIN order_items oi ON o.order_id = oi.order_id LIMIT 5;' }
    ],
    takeaways: [
      'JOINs combine rows from two tables on a shared column.',
      'The ON clause defines how rows are matched.',
      'Join types differ only in which non-matching rows you keep.'
    ]
  },

  '3.2': {
    title: 'INNER JOIN',
    lead: 'Returns only rows that match in both tables. The most common join by a mile.',
    sections: [
      {
        title: 'Pattern',
        body: `<p><code>FROM tableA INNER JOIN tableB ON tableA.col = tableB.col</code>. The word <code>INNER</code> is optional — plain <code>JOIN</code> means INNER JOIN.</p>`,
        examples: [
          { sql: "-- Every delivered order with the customer's name\nSELECT c.name, o.order_id, o.total_amount\nFROM customers c\nINNER JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'delivered';" },
          { sql: '-- Three-table join: customer + order + item\nSELECT c.name, o.order_id, oi.product_id, oi.quantity\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nJOIN order_items oi ON o.order_id = oi.order_id\nLIMIT 8;' }
        ]
      }
    ],
    insight: 'INNER JOIN silently drops rows with no match. If a customer has no orders, they vanish from the result. Use LEFT JOIN if you want to keep them.',
    practice: [
      { prompt: 'Show every order with the customer name. Use INNER JOIN.', solution: 'SELECT c.name, o.order_id, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id;' },
      { prompt: 'Show every item ever ordered with its product name and quantity.', solution: 'SELECT p.name, oi.quantity FROM order_items oi JOIN products p ON oi.product_id = p.product_id;' }
    ],
    takeaways: [
      '<code>INNER JOIN</code> keeps only rows matching in both tables.',
      'Always alias tables (<code>c</code> for customers).',
      'Use it when you want only complete pairs.'
    ]
  },

  '3.3': {
    title: 'LEFT and RIGHT JOIN',
    lead: 'LEFT JOIN keeps all rows from the left table even when there is no match on the right.',
    sections: [
      {
        title: 'When to use LEFT JOIN',
        body: `<p>The classic use case: <strong>"find everything in A that has no match in B"</strong>. LEFT JOIN + WHERE right_col IS NULL.</p>`,
        examples: [
          { sql: '-- Every customer + their order count (0 if no orders)\nSELECT c.name, COUNT(o.order_id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.name;' },
          { sql: '-- Customers who have NEVER ordered\nSELECT c.name FROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;' }
        ]
      }
    ],
    insight: 'RIGHT JOIN exists but is almost never used in practice — people just flip the table order and use LEFT JOIN, which reads more naturally.',
    practice: [
      { prompt: 'Find products that have NEVER been ordered.', solution: 'SELECT p.name FROM products p LEFT JOIN order_items oi ON p.product_id = oi.product_id WHERE oi.product_id IS NULL;' },
      { prompt: 'Show each customer\'s name and their total spent (0 if no orders).', solution: 'SELECT c.name, COALESCE(SUM(o.total_amount), 0) AS spent FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name;' }
    ],
    takeaways: [
      '<code>LEFT JOIN</code> keeps every row from the left table; NULL fills the right.',
      'LEFT JOIN + <code>IS NULL</code> finds rows with no related record.',
      'RIGHT JOIN exists but is rarely used — just flip table order.'
    ]
  },

  '3.4': {
    title: 'FULL OUTER and CROSS JOIN',
    lead: 'FULL OUTER keeps everything from both sides. CROSS JOIN multiplies — every row × every row.',
    sections: [
      {
        title: 'FULL OUTER JOIN',
        body: `<p>Keeps all rows from both tables. NULLs fill in wherever there is no match. Note: not supported in older MySQL — simulate with <code>LEFT UNION RIGHT</code>.</p>`
      },
      {
        title: 'CROSS JOIN',
        body: `<p>The Cartesian product: every row in A paired with every row in B. <strong>Use deliberately — it explodes fast.</strong> 1000 × 1000 = 1 million rows.</p>`,
        examples: [
          { sql: '-- Every customer × every product combination\nSELECT c.name AS customer, p.name AS product\nFROM customers c\nCROSS JOIN products p\nLIMIT 8;' }
        ]
      }
    ],
    insight: 'Always know the row count BEFORE running a CROSS JOIN on production data. 1M-row × 1M-row CROSS JOIN = a trillion rows.',
    practice: [
      { prompt: 'How many rows does CROSS JOIN of customers (8) × products (8) return?', solution: '64 rows. CROSS JOIN multiplies row counts.' }
    ],
    takeaways: [
      '<code>FULL OUTER JOIN</code> = all rows from both sides, NULL where no match.',
      '<code>CROSS JOIN</code> = every row × every row. Use carefully.',
      'SQLite and older MySQL do not support FULL OUTER — use LEFT UNION RIGHT.'
    ]
  },

  '3.5': {
    title: 'Self-joins',
    lead: 'A self-join joins a table to itself. Essential for hierarchies like employees and managers.',
    sections: [
      {
        title: 'Pattern',
        body: `<p>Treat one table as if it were two — give it two aliases. Mandatory for hierarchical data.</p>`,
        examples: [
          { sql: "-- Each employee with their manager's name\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.employee_id;" }
        ]
      }
    ],
    insight: 'LEFT JOIN matters here. INNER JOIN would drop top-level managers (who have no manager themselves).',
    practice: [
      { prompt: 'For each manager, show how many direct reports they have.', solution: 'SELECT m.name AS manager, COUNT(e.employee_id) AS reports FROM employees m JOIN employees e ON e.manager_id = m.employee_id GROUP BY m.name;' }
    ],
    takeaways: [
      'Self-joins join a table to itself; aliases are mandatory.',
      'Perfect for hierarchies (employees/managers, categories/subcategories).',
      'Use LEFT JOIN to include rows with no related row.'
    ]
  },

  '3.6': {
    title: 'Subqueries',
    lead: 'A query inside another query, wrapped in parentheses. Useful but easy to misuse.',
    sections: [
      {
        title: 'Where subqueries appear',
        body: `<p>Subqueries can appear in <code>SELECT</code>, <code>FROM</code>, or <code>WHERE</code>. The most common spot is WHERE.</p>`,
        examples: [
          { sql: '-- Products priced above the average\nSELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);' },
          { sql: '-- Customers from cities where someone is over 50\nSELECT name FROM customers\nWHERE city IN (SELECT city FROM customers WHERE age > 50);' }
        ]
      }
    ],
    insight: 'Subqueries in <code>SELECT</code> that run per row are a performance trap. Most can be rewritten as JOINs or CTEs for both clarity and speed.',
    practice: [
      { prompt: 'Find customers older than the average customer age.', solution: 'SELECT name FROM customers WHERE age > (SELECT AVG(age) FROM customers);' },
      { prompt: 'Find products that cost more than the cheapest product in Electronics.', solution: "SELECT name, price FROM products WHERE price > (SELECT MIN(price) FROM products WHERE category = 'Electronics');" }
    ],
    takeaways: [
      'Subqueries are queries wrapped in parentheses inside another query.',
      'Most common spot: <code>WHERE col op (SELECT ...)</code>.',
      'Be wary of subqueries that re-execute per row — they kill performance.'
    ]
  },

  '3.7': {
    title: 'CTEs (WITH clause)',
    lead: 'CTEs let you name and reuse intermediate results. Multi-step logic becomes readable.',
    sections: [
      {
        title: 'WITH ... AS (...)',
        body: `<p>Define a named subquery with <code>WITH</code>, then use it in the main query like a table. Read top-down: "first compute X, then use X to compute Y".</p>`,
        examples: [
          { sql: '-- Customers and their order count, then filter\nWITH customer_orders AS (\n  SELECT customer_id, COUNT(*) AS order_count\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT * FROM customer_orders WHERE order_count >= 2;' },
          { sql: '-- Recursive CTE: numbers 1-10\nWITH RECURSIVE nums AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1 FROM nums WHERE n < 10\n)\nSELECT * FROM nums;' }
        ]
      }
    ],
    insight: 'CTEs are vastly more readable than nested subqueries. Even when not strictly needed, use them for multi-step logic.',
    practice: [
      { prompt: 'Use a CTE called <code>high_value_orders</code> for orders > $100, then count them.', solution: 'WITH high_value_orders AS (SELECT * FROM orders WHERE total_amount > 100) SELECT COUNT(*) FROM high_value_orders;' }
    ],
    takeaways: [
      '<code>WITH name AS (...)</code> defines a named subquery — a CTE.',
      'CTEs make multi-step queries readable and reusable within a statement.',
      'They are queries, not stored objects — they vanish after the query runs.'
    ]
  },

  /* ==================== LEVEL 4 ==================== */

  '4.1': {
    title: 'Window functions',
    lead: 'Calculate a value across a set of rows WITHOUT collapsing them like GROUP BY does. This is where you stop being a junior.',
    sections: [
      {
        title: 'The ranking functions',
        body: `
          <ul>
            <li><code>ROW_NUMBER()</code> — unique 1, 2, 3 (ties broken arbitrarily)</li>
            <li><code>RANK()</code> — ties share rank, then skips: 1, 1, 3</li>
            <li><code>DENSE_RANK()</code> — ties share rank, no skip: 1, 1, 2</li>
            <li><code>NTILE(n)</code> — divide into n equal buckets (quartiles, deciles)</li>
          </ul>
          <p>All need <code>OVER (...)</code> with <code>PARTITION BY</code> (group) and <code>ORDER BY</code> (sort within group).</p>
        `,
        examples: [
          { sql: '-- Rank products by price within each category\nSELECT category, name, price,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn\nFROM products;' }
        ]
      }
    ],
    insight: 'For "top 3 per group" use <code>DENSE_RANK</code> if ties should all count, <code>ROW_NUMBER</code> if you want exactly 3.',
    practice: [
      { prompt: 'Return each employee with their salary rank within their department (highest = 1).', solution: 'SELECT name, salary, department, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees;' }
    ],
    takeaways: [
      'Window functions add a column based on a "window" of rows — without collapsing them.',
      '<code>PARTITION BY</code> defines the window; <code>ORDER BY</code> sorts within it.',
      'Use ROW_NUMBER / RANK / DENSE_RANK for "top N per group" queries.'
    ]
  },

  '4.2': {
    title: 'Window frames',
    lead: 'Inside OVER() you can define a frame — a sliding window of rows. Running totals, moving averages, all live here.',
    sections: [
      {
        title: 'Frame syntax',
        body: `<p><code>OVER (ORDER BY col ROWS BETWEEN N PRECEDING AND CURRENT ROW)</code> defines a trailing window. Without ORDER BY, the frame is the entire partition.</p>`,
        examples: [
          { sql: '-- Running total over time\nSELECT order_id, order_date, total_amount,\n  SUM(total_amount) OVER (ORDER BY order_date) AS running_total\nFROM orders;' },
          { sql: '-- 3-row moving average\nSELECT order_date, total_amount,\n  AVG(total_amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS ma_3\nFROM orders;' }
        ]
      }
    ],
    insight: 'Running totals, moving averages, percent-of-total — all are window-frame tricks. They were a nightmare before window functions; now they are one line.',
    practice: [
      { prompt: 'Show each order with what percent of total revenue it represents.', solution: 'SELECT order_id, total_amount, ROUND(100.0 * total_amount / SUM(total_amount) OVER (), 2) AS pct FROM orders;' }
    ],
    takeaways: [
      'Frames define which rows an aggregate window sees.',
      '<code>SUM(x) OVER (ORDER BY y)</code> is a running total.',
      'Use frames for running totals, moving averages, percent-of-total.'
    ]
  },

  '4.3': {
    title: 'LAG and LEAD',
    lead: 'Compare a row to the row before or after. The cleanest way to compute "delta from previous period".',
    sections: [
      {
        title: 'Syntax',
        body: `<p><code>LAG(col, n)</code> returns the value n rows before. <code>LEAD(col, n)</code> returns n rows after. Both need OVER (ORDER BY ...).</p>`,
        examples: [
          { sql: '-- Difference between consecutive orders\nSELECT order_id, order_date, total_amount,\n  LAG(total_amount) OVER (ORDER BY order_date) AS prev,\n  total_amount - LAG(total_amount) OVER (ORDER BY order_date) AS change\nFROM orders;' }
        ]
      }
    ],
    insight: 'Boundary rows return NULL — no previous/next exists.',
    practice: [
      { prompt: 'Show each order with the NEXT order\'s amount.', solution: 'SELECT order_id, order_date, total_amount, LEAD(total_amount) OVER (ORDER BY order_date) AS next_amount FROM orders;' }
    ],
    takeaways: [
      '<code>LAG(col)</code> looks back; <code>LEAD(col)</code> looks forward.',
      'Both require <code>OVER (ORDER BY ...)</code>.',
      'Boundary rows get NULL.'
    ]
  },

  '4.4': {
    title: 'CASE WHEN',
    lead: 'SQL\'s if/else. Conditional logic inside any expression.',
    sections: [
      {
        title: 'Syntax',
        body: `<p><code>CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE default END</code>. Evaluates top-down, first match wins.</p>`,
        examples: [
          { sql: "-- Tag products by price tier\nSELECT name, price,\n  CASE\n    WHEN price < 25 THEN 'budget'\n    WHEN price < 75 THEN 'mid'\n    ELSE 'premium'\n  END AS tier\nFROM products;" },
          { sql: "-- Conditional counting (very common pattern)\nSELECT\n  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled\nFROM orders;" }
        ]
      }
    ],
    insight: '<code>SUM(CASE WHEN cond THEN 1 ELSE 0 END)</code> counts a subset without filtering the whole query. Memorize this pattern.',
    practice: [
      { prompt: "Bucket customers by age: <30=young, 30-50=middle, >50=senior.", solution: "SELECT name, age, CASE WHEN age < 30 THEN 'young' WHEN age <= 50 THEN 'middle' ELSE 'senior' END AS age_group FROM customers;" }
    ],
    takeaways: [
      '<code>CASE WHEN cond THEN val ... ELSE val END</code> is SQL\'s if/else.',
      'Conditions are evaluated top-down; first match wins.',
      'Pair with aggregates for conditional counting/summing.'
    ]
  },

  '4.5': {
    title: 'EXISTS and NOT EXISTS',
    lead: 'EXISTS checks if a subquery returns any row. Cleaner than IN, NULL-safe, and usually faster.',
    sections: [
      {
        title: 'Pattern',
        body: `<p><code>WHERE EXISTS (SELECT 1 FROM ... WHERE correlation)</code>. The <code>SELECT 1</code> is convention — what you select inside EXISTS does not matter.</p>`,
        examples: [
          { sql: '-- Customers who have placed at least one order\nSELECT name FROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);' },
          { sql: '-- Customers who have NEVER ordered\nSELECT name FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);' }
        ]
      }
    ],
    insight: 'NOT EXISTS is the cleanest, NULL-safest way to express "find rows with no matching child". Prefer it over <code>NOT IN</code>.',
    practice: [
      { prompt: 'Find customers who have never placed an order, using NOT EXISTS.', solution: 'SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);' }
    ],
    takeaways: [
      '<code>EXISTS (subq)</code> is true if the subquery returns any row.',
      'Use <code>SELECT 1</code> inside EXISTS — the column list is ignored.',
      'NOT EXISTS is the cleanest "find rows with no matching child".'
    ]
  },

  '4.6': {
    title: 'UNION, INTERSECT, EXCEPT',
    lead: 'Set operators combine results from two SELECT statements with matching columns.',
    sections: [
      {
        title: 'The four',
        body: `
          <ul>
            <li><code>UNION</code> — combine, dedupe</li>
            <li><code>UNION ALL</code> — combine, keep duplicates (faster!)</li>
            <li><code>INTERSECT</code> — rows in both</li>
            <li><code>EXCEPT</code> (or <code>MINUS</code> in Oracle) — in A but not B</li>
          </ul>
          <p>Both SELECTs must have the <strong>same number of columns</strong> with <strong>compatible types</strong>.</p>
        `,
        examples: [
          { sql: '-- Names from customers and employees combined\nSELECT name FROM customers\nUNION ALL\nSELECT name FROM employees\nORDER BY name LIMIT 10;' }
        ]
      }
    ],
    insight: 'Prefer <code>UNION ALL</code> over <code>UNION</code> for performance when you do not need to dedupe.',
    practice: [
      { prompt: 'Combine all names from customers and employees into one list.', solution: 'SELECT name FROM customers UNION ALL SELECT name FROM employees;' }
    ],
    takeaways: [
      'Set operators combine results from two SELECTs.',
      'Columns must match in number and type.',
      '<code>UNION ALL</code> > <code>UNION</code> for performance when dedupe is not needed.'
    ]
  },

  '4.7': {
    title: 'Indexes',
    lead: 'A data structure (usually a B-tree) that lets the database find rows fast without scanning the whole table.',
    sections: [
      {
        title: 'Trade-offs',
        body: `
          <p><strong>Indexes speed up reads</strong> (SELECT, WHERE, JOIN, ORDER BY).</p>
          <p><strong>Indexes slow down writes</strong> (INSERT, UPDATE, DELETE — they have to be kept in sync).</p>
          <p><strong>Primary keys are indexed automatically.</strong> Foreign keys are NOT — add them yourself.</p>
        `,
        examples: [
          { sql: "-- Create an index\nCREATE INDEX idx_orders_customer ON orders(customer_id);\n\n-- Now this is a fast lookup, not a full scan\nSELECT * FROM orders WHERE customer_id = 1;" }
        ]
      }
    ],
    insight: 'Composite index <code>(a, b)</code> works for queries filtering on <code>a</code> alone, or <code>a AND b</code>, but NOT for <code>b</code> alone. Left-prefix rule.',
    practice: [
      { prompt: 'You frequently query orders by customer_id and order_date. What index should you create?', solution: 'CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date); — a composite index serving both filters.' }
    ],
    takeaways: [
      'Indexes make reads fast and writes slower.',
      'Index columns that appear in WHERE, JOIN, or ORDER BY.',
      'Composite index (a, b) covers (a) or (a, b) but not (b) alone.'
    ]
  },

  /* ==================== LEVEL 5 ==================== */

  '5.1': {
    title: 'Database design & normalization',
    lead: 'Split data into multiple tables to remove redundancy. The three normal forms.',
    sections: [
      {
        title: 'The three normal forms',
        body: `
          <ul>
            <li><strong>1NF</strong> — atomic values (no lists or arrays in cells)</li>
            <li><strong>2NF</strong> — no partial dependencies on composite keys</li>
            <li><strong>3NF</strong> — no transitive dependencies (non-key cols depend only on the key)</li>
          </ul>
          <p><strong>Foreign keys</strong> enforce referential integrity — they prevent orphan references.</p>
        `
      }
    ],
    insight: 'Denormalization (e.g. star schemas) is often correct for analytics — trade write complexity for read speed. Normalize for OLTP, denormalize for OLAP.',
    practice: [
      { prompt: 'A products table has (id, name, category_id, category_name, category_description). What normal form does it violate?', solution: '3NF. category_name and category_description depend on category_id, not on the product\'s primary key — a transitive dependency. Fix: extract a separate categories table.' }
    ],
    takeaways: [
      'Normalization removes redundancy: 1NF → 2NF → 3NF.',
      'Foreign keys enforce referential integrity.',
      'Denormalize deliberately for measured read gains.'
    ]
  },

  '5.2': {
    title: 'Transactions & ACID',
    lead: 'A transaction is a group of statements that succeed or fail as a unit. ACID is the contract that makes databases trustworthy.',
    sections: [
      {
        title: 'ACID',
        body: `
          <ul>
            <li><strong>A</strong>tomicity — all-or-nothing</li>
            <li><strong>C</strong>onsistency — every transaction takes the DB from one valid state to another</li>
            <li><strong>I</strong>solation — concurrent transactions don\'t see each other\'s in-progress changes</li>
            <li><strong>D</strong>urability — committed changes survive crashes</li>
          </ul>
        `,
        examples: [
          { sql: '-- Atomic money transfer\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- On error: ROLLBACK; (undoes both)' }
        ]
      }
    ],
    insight: 'Always wrap multi-statement state changes in a transaction. Many client errors don\'t auto-rollback.',
    practice: [
      { prompt: 'Name the four ACID properties.', solution: 'Atomicity, Consistency, Isolation, Durability.' }
    ],
    takeaways: [
      'Transactions: BEGIN → ... → COMMIT/ROLLBACK. All or nothing.',
      'ACID = Atomicity, Consistency, Isolation, Durability.',
      'Wrap any multi-statement state change in a transaction.'
    ]
  },

  '5.3': {
    title: 'Views & Materialized Views',
    lead: 'Saved queries. Views recompute every time; materialized views cache the result.',
    sections: [
      {
        title: 'View vs Materialized View',
        body: `
          <p><strong>View</strong> — just a saved query. Runs underlying query every time you SELECT.</p>
          <p><strong>Materialized View</strong> — stores the result physically. Must be <code>REFRESH</code>ed to update. Fast reads, stale data until refresh.</p>
        `,
        examples: [
          { sql: '-- Create a view\nCREATE VIEW customer_summary AS\nSELECT customer_id, COUNT(*) AS orders, SUM(total_amount) AS ltv\nFROM orders GROUP BY customer_id;\n\n-- Use it like a table\nSELECT * FROM customer_summary WHERE ltv > 100;' }
        ]
      }
    ],
    insight: 'PostgreSQL supports both. MySQL only supports plain views (until recently).',
    practice: [
      { prompt: 'Create a view called <code>top_products</code> showing products with price > 50.', solution: 'CREATE VIEW top_products AS SELECT * FROM products WHERE price > 50;' }
    ],
    takeaways: [
      'Views = saved queries, recomputed on every read.',
      'Materialized views = stored result, refreshed manually.',
      'Use views for abstraction; materialized views for caching expensive queries.'
    ]
  },

  '5.4': {
    title: 'Stored procedures & functions',
    lead: 'Reusable code stored in the database. Functions return values; procedures perform actions.',
    sections: [
      {
        title: 'When to use them',
        body: `
          <p>Use stored procedures/functions for:</p>
          <ul>
            <li>Eliminating network round-trips for multi-step DB work</li>
            <li>Centralizing data-access logic across multiple apps</li>
            <li>Atomic multi-statement operations</li>
            <li>Hot performance-critical paths</li>
          </ul>
          <p>Modern preference: app-layer logic for testability, DB for hot paths.</p>
        `
      }
    ],
    insight: 'Functions return values and can be used in queries: <code>SELECT my_fn(x)</code>. Procedures are called with <code>CALL</code> and perform multi-statement work.',
    practice: [
      { prompt: 'Why might you prefer a stored procedure over equivalent application code?', solution: 'Fewer network round-trips, centralized data-access logic, atomic multi-statement work, centralized security.' }
    ],
    takeaways: [
      'Functions return values; procedures perform actions.',
      'They eliminate network round-trips for multi-step DB work.',
      'Modern preference: app-layer logic for testability, DB for hot paths.'
    ]
  },

  '5.5': {
    title: 'Query optimization & EXPLAIN',
    lead: 'EXPLAIN shows the database\'s execution plan. Reading it is the most important debugging skill in SQL.',
    sections: [
      {
        title: 'What to look for',
        body: `
          <ul>
            <li><strong>Seq Scan on a large table</strong> → missing index</li>
            <li><strong>Nested Loop on big inputs</strong> → bad join strategy</li>
            <li><strong>Rows: actual >> expected</strong> → stale statistics (run ANALYZE)</li>
            <li><strong>Sort with disk spill</strong> → not enough memory or unnecessary sort</li>
          </ul>
        `,
        examples: [
          { sql: '-- See the plan\nEXPLAIN SELECT * FROM orders WHERE customer_id = 1;\n\n-- With real timing (PostgreSQL)\nEXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 1;' }
        ]
      },
      {
        title: 'Top three wins',
        body: `
          <ol>
            <li>Index columns used in WHERE, JOIN, ORDER BY</li>
            <li>Avoid <code>SELECT *</code> — fetch only what you need</li>
            <li>Filter early — push WHERE conditions as deep as possible</li>
          </ol>
        `
      }
    ],
    insight: 'A sequential scan on a 10M-row table for one specific customer = pain. <code>CREATE INDEX</code> turns it into a fast lookup.',
    practice: [
      { prompt: 'EXPLAIN shows Seq Scan on orders filtering by customer_id on a 10M-row table. Most impactful fix?', solution: 'CREATE INDEX idx_orders_customer ON orders(customer_id); — turns the seq scan into a fast index lookup.' }
    ],
    takeaways: [
      '<code>EXPLAIN ANALYZE</code> shows the actual execution plan.',
      'Watch for seq scans on big tables and unexpected nested loops.',
      'Top wins: index hot columns, avoid SELECT *, filter early.'
    ]
  },

  '5.6': {
    title: 'Capstone: e-commerce queries',
    lead: 'You\'ve learned every core SQL skill. Time to apply them to real business questions.',
    sections: [
      {
        title: '10 real business queries to write',
        body: `
          <p>Try each of these on the playground using the dataset. Each combines multiple skills.</p>
          <ol>
            <li>Top 5 customers by lifetime value</li>
            <li>Best-selling product in each category by quantity</li>
            <li>Month-over-month revenue growth</li>
            <li>Customers who placed an order this month but not last month</li>
            <li>Average days between orders per customer</li>
            <li>Products that have never been ordered</li>
            <li>Top 3 highest-paid employees per department</li>
            <li>Running total of revenue over time</li>
            <li>Customer retention: who ordered in both Q1 and Q2 2024</li>
            <li>The "average customer journey": orders → revenue → items per order</li>
          </ol>
        `,
        examples: [
          { sql: '-- Example: Top 5 customers by LTV\nWITH ltv AS (\n  SELECT customer_id, SUM(total_amount) AS lifetime_value\n  FROM orders WHERE status = \'delivered\'\n  GROUP BY customer_id\n)\nSELECT c.name, c.city, ltv.lifetime_value\nFROM customers c\nJOIN ltv ON c.customer_id = ltv.customer_id\nORDER BY ltv.lifetime_value DESC LIMIT 5;' },
          { sql: "-- Example: Best-selling product per category\nWITH ranked AS (\n  SELECT p.category, p.name, SUM(oi.quantity) AS qty,\n    RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rnk\n  FROM products p JOIN order_items oi ON p.product_id = oi.product_id\n  GROUP BY p.category, p.name\n)\nSELECT category, name, qty FROM ranked WHERE rnk = 1;" }
        ]
      }
    ],
    insight: 'Real-world SQL is rarely one clean SELECT. It\'s CTEs stitching together filtered subsets, with windows for rankings and CASE WHEN for business rules.',
    practice: [
      { prompt: 'Write a query for the best-selling product per category by quantity.', solution: "WITH ranked AS (SELECT p.category, p.name, SUM(oi.quantity) AS qty, RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rnk FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.category, p.name) SELECT category, name, qty FROM ranked WHERE rnk = 1;" }
    ],
    takeaways: [
      'Real SQL combines every skill: CTEs, joins, aggregates, windows.',
      'Break big problems into named CTE steps.',
      'You\'re now a SQLSENSEI graduate. 🥋'
    ]
  }
};
