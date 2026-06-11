/* ============================================
   SQLSENSEI — Lesson content
   Each module: concept, sample tables, example query,
   example result, key insight, exercise w/ checker.
   ============================================ */

window.LESSONS = {

  /* ==================== LEVEL 1: FOUNDATIONS ==================== */

  '1.1': {
    moduleId: '1.1',
    title: 'What is a database?',
    concept:
      'A database stores data in **tables**. Each table is a grid: **columns** define what kind of data (name, age, price), and **rows** are individual records. Every column has a **data type** that constrains what can go in it (INT for whole numbers, VARCHAR for text, DATE for dates, DECIMAL for money).',
    tables: ['customers'],
    example: null, // Pure concept module
    insight:
      'A table is like a strict spreadsheet — every row in a column must match the declared data type. That strictness is what makes SQL fast and reliable.',
    exercise: {
      prompt:
        'Look at the customers table above. **Which column is the primary key**, and what data type does it use?\n\nType your answer below (free-form).',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const hasPk = t.includes('customer_id');
        const hasInt = t.includes('int');
        return { correct: hasPk && hasInt, feedback: hasPk && hasInt
          ? 'Exactly. `customer_id` is the primary key (INT). Primary keys uniquely identify each row.'
          : 'Look at the first column. The label `(PK)` or `INT, PK` is your hint.' };
      }
    },
    takeaways: [
      'Databases store data in **tables** made of **rows** and **columns**.',
      'Every column has a **data type** (INT, VARCHAR, DATE, DECIMAL).',
      'A **primary key** uniquely identifies each row in a table.'
    ]
  },

  '1.2': {
    moduleId: '1.2',
    title: 'Your first SELECT',
    concept:
      '`SELECT` is how you read data from a table. The simplest form is `SELECT <columns> FROM <table>`. Use `*` to get every column, or list specific column names separated by commas.',
    tables: ['customers'],
    example: {
      sql: '-- Get the name and city of every customer\nSELECT name, city\nFROM customers;',
      result: {
        columns: ['name', 'city'],
        rows: [
          ['Aarav Mehta', 'Mumbai'],
          ['Sofia Reyes', 'Madrid'],
          ['Kenji Tanaka', 'Tokyo'],
          ['Priya Singh', 'Delhi'],
          ['Liam Doyle', 'Dublin'],
          ['Chen Wei', 'Shanghai'],
          ['Amara Okafor', 'Lagos'],
          ['Noa Cohen', 'Tel Aviv']
        ]
      }
    },
    insight:
      'Prefer named columns over `SELECT *` in production code — it makes queries faster, more explicit, and resilient to table changes.',
    exercise: {
      prompt:
        'Write a query that retrieves only the `name` and `age` columns from the `customers` table.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'customers'],
        mustHave: ['name', 'age'],
        forbidden: ['*']
      },
      sampleAnswer: 'SELECT name, age FROM customers;'
    },
    takeaways: [
      'Use `SELECT col1, col2 FROM table` to retrieve specific columns.',
      '`SELECT *` returns everything — convenient but slower and less safe.',
      'Every SQL statement ends with a semicolon `;`.'
    ]
  },

  '1.3': {
    moduleId: '1.3',
    title: 'WHERE clause',
    concept:
      '`WHERE` filters rows. It comes after `FROM`. Use comparison operators (`=`, `!=`, `<`, `>`, `<=`, `>=`) and combine conditions with `AND`, `OR`, `NOT`. Text values go in single quotes.',
    tables: ['customers'],
    example: {
      sql: "-- All customers from Mumbai aged over 25\nSELECT name, city, age\nFROM customers\nWHERE city = 'Mumbai' AND age > 25;",
      result: {
        columns: ['name', 'city', 'age'],
        rows: [['Aarav Mehta', 'Mumbai', 28]]
      }
    },
    insight:
      'A common beginner mistake: using `=` to check for NULL. **Never works.** Always use `IS NULL` or `IS NOT NULL` for missing values.',
    exercise: {
      prompt:
        'Write a query that returns the `name` and `age` of all customers **aged 30 or older**.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'WHERE', 'customers'],
        mustHave: ['name', 'age', '>='],
        regex: /age\s*>=\s*30/i
      },
      sampleAnswer: 'SELECT name, age FROM customers WHERE age >= 30;'
    },
    takeaways: [
      '`WHERE` filters rows based on a condition.',
      'Combine conditions with `AND`, `OR`, `NOT`.',
      'Text comparisons use single quotes: `city = \'Mumbai\'`.'
    ]
  },

  '1.4': {
    moduleId: '1.4',
    title: 'ORDER BY and LIMIT',
    concept:
      '`ORDER BY` sorts your results — `ASC` for ascending (default), `DESC` for descending. `LIMIT` caps the number of rows returned. Together they give you "top N" queries.',
    tables: ['customers'],
    example: {
      sql: '-- Top 3 oldest customers\nSELECT name, age\nFROM customers\nORDER BY age DESC\nLIMIT 3;',
      result: {
        columns: ['name', 'age'],
        rows: [
          ['Liam Doyle', 52],
          ['Noa Cohen', 45],
          ['Kenji Tanaka', 41]
        ]
      }
    },
    insight:
      'Order of clauses matters: `SELECT → FROM → WHERE → ORDER BY → LIMIT`. Get this wrong and SQL will refuse to run.',
    exercise: {
      prompt:
        'Write a query that returns the **5 most recently signed-up customers** — show their `name` and `signup_date`, sorted from newest to oldest.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
        mustHave: ['signup_date', 'DESC', '5']
      },
      sampleAnswer: 'SELECT name, signup_date FROM customers ORDER BY signup_date DESC LIMIT 5;'
    },
    takeaways: [
      '`ORDER BY column DESC` sorts results highest-to-lowest.',
      '`LIMIT n` returns at most `n` rows.',
      'Clause order is non-negotiable: SELECT → FROM → WHERE → ORDER BY → LIMIT.'
    ]
  },

  '1.5': {
    moduleId: '1.5',
    title: 'DISTINCT and NULL',
    concept:
      '`SELECT DISTINCT col` removes duplicate values from your results. `NULL` is SQL\'s way of saying "no value" — it\'s **not** the same as 0 or an empty string. Test for NULL with `IS NULL` / `IS NOT NULL`.',
    tables: ['customers', 'employees'],
    example: {
      sql: '-- Every unique city we serve\nSELECT DISTINCT city\nFROM customers\nORDER BY city;',
      result: {
        columns: ['city'],
        rows: [['Delhi'], ['Dublin'], ['Lagos'], ['Madrid'], ['Mumbai'], ['Shanghai'], ['Tel Aviv'], ['Tokyo']]
      }
    },
    insight:
      'NULL is contagious: `NULL + 1 = NULL`, `NULL = NULL` is also NULL (not true!). Anything that touches NULL becomes NULL.',
    exercise: {
      prompt:
        'Look at the `employees` table. Write a query that returns the **names of all employees who do NOT have a manager** (their `manager_id` is NULL).',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'employees', 'WHERE'],
        mustHave: ['manager_id', 'IS NULL']
      },
      sampleAnswer: 'SELECT name FROM employees WHERE manager_id IS NULL;'
    },
    takeaways: [
      '`SELECT DISTINCT` strips duplicate values from your result.',
      'NULL means "unknown" — use `IS NULL` / `IS NOT NULL`, never `= NULL`.',
      'NULL is contagious: any expression touching NULL becomes NULL.'
    ]
  },

  /* ==================== LEVEL 2: SHAPING DATA ==================== */

  '2.1': {
    moduleId: '2.1',
    title: 'Aggregate functions',
    concept:
      'Aggregate functions collapse many rows into a single value. The big five: `COUNT(*)` counts rows, `SUM` adds, `AVG` averages, `MIN`/`MAX` find extremes. They ignore NULLs (except `COUNT(*)`).',
    tables: ['orders'],
    example: {
      sql: '-- Total revenue and average order value\nSELECT\n  COUNT(*) AS total_orders,\n  SUM(total_amount) AS revenue,\n  AVG(total_amount) AS avg_order\nFROM orders\nWHERE status = \'delivered\';',
      result: {
        columns: ['total_orders', 'revenue', 'avg_order'],
        rows: [[7, 894.49, 127.78]]
      }
    },
    insight:
      '`COUNT(*)` counts all rows; `COUNT(column)` counts only non-NULL values in that column. Pick deliberately.',
    exercise: {
      prompt:
        'Write a query that returns the **highest** and **lowest** prices in the `products` table. Label them `max_price` and `min_price`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'products'],
        mustHave: ['MAX', 'MIN', 'price']
      },
      sampleAnswer: 'SELECT MAX(price) AS max_price, MIN(price) AS min_price FROM products;'
    },
    takeaways: [
      'Aggregates collapse rows: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.',
      '`COUNT(*)` counts rows; `COUNT(col)` counts non-NULL values.',
      'Aggregates silently ignore NULL — sometimes a gift, sometimes a trap.'
    ]
  },

  '2.2': {
    moduleId: '2.2',
    title: 'GROUP BY',
    concept:
      '`GROUP BY` splits rows into buckets, then runs aggregates per bucket. If you put a column in `SELECT` alongside an aggregate, it **must** be in `GROUP BY`.',
    tables: ['orders'],
    example: {
      sql: '-- Total spent per customer\nSELECT customer_id, COUNT(*) AS order_count, SUM(total_amount) AS total_spent\nFROM orders\nGROUP BY customer_id\nORDER BY total_spent DESC;',
      result: {
        columns: ['customer_id', 'order_count', 'total_spent'],
        rows: [
          [1, 3, 168.99],
          [5, 1, 250.00],
          [4, 1, 24.99],
          [3, 1, 148.00],
          [2, 2, 221.00],
          [6, 1, 18.75],
          [7, 1, 64.00]
        ]
      }
    },
    insight:
      'Mnemonic: every column in `SELECT` must either be **inside an aggregate** or **inside `GROUP BY`**. No exceptions.',
    exercise: {
      prompt:
        'Write a query that returns **how many products are in each category**. Use the `products` table. Show `category` and a count called `product_count`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'products', 'GROUP BY'],
        mustHave: ['category', 'COUNT']
      },
      sampleAnswer: 'SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;'
    },
    takeaways: [
      '`GROUP BY col` runs aggregates per unique value of `col`.',
      'Every non-aggregated SELECT column must appear in `GROUP BY`.',
      '`GROUP BY` is the bridge between row-level data and summary-level insights.'
    ]
  },

  '2.3': {
    moduleId: '2.3',
    title: 'HAVING',
    concept:
      '`WHERE` filters **rows before** grouping. `HAVING` filters **groups after** aggregation. You can\'t use aggregates in `WHERE`, but you can in `HAVING`.',
    tables: ['orders'],
    example: {
      sql: '-- Customers who spent over $100 in total\nSELECT customer_id, SUM(total_amount) AS total_spent\nFROM orders\nGROUP BY customer_id\nHAVING SUM(total_amount) > 100;',
      result: {
        columns: ['customer_id', 'total_spent'],
        rows: [
          [1, 168.99],
          [2, 221.00],
          [3, 148.00],
          [5, 250.00]
        ]
      }
    },
    insight:
      'Rule of thumb: if your filter involves an aggregate (`SUM`, `COUNT`, etc.), use `HAVING`. Otherwise use `WHERE`.',
    exercise: {
      prompt:
        'Using `order_items`, find every `product_id` that appears in **more than 1 order**. Show the `product_id` and the count.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'order_items', 'GROUP BY', 'HAVING'],
        mustHave: ['product_id', 'COUNT'],
        regex: />\s*1/
      },
      sampleAnswer: 'SELECT product_id, COUNT(*) AS times_ordered FROM order_items GROUP BY product_id HAVING COUNT(*) > 1;'
    },
    takeaways: [
      '`WHERE` filters individual rows; `HAVING` filters groups.',
      'Aggregates work in `HAVING` but never in `WHERE`.',
      'Clause order: `WHERE → GROUP BY → HAVING → ORDER BY`.'
    ]
  },

  '2.4': {
    moduleId: '2.4',
    title: 'Aliases',
    concept:
      'Aliases rename columns and tables in your output using `AS`. Column aliases make output readable; table aliases make queries shorter, especially with joins.',
    tables: ['customers'],
    example: {
      sql: '-- Friendly column names\nSELECT\n  name AS customer_name,\n  city AS location,\n  age AS years_old\nFROM customers AS c\nWHERE c.age > 30;',
      result: {
        columns: ['customer_name', 'location', 'years_old'],
        rows: [
          ['Sofia Reyes', 'Madrid', 34],
          ['Kenji Tanaka', 'Tokyo', 41],
          ['Liam Doyle', 'Dublin', 52],
          ['Chen Wei', 'Shanghai', 31],
          ['Noa Cohen', 'Tel Aviv', 45]
        ]
      }
    },
    insight:
      '`AS` is optional in most dialects (`customers c` works), but writing it out is more readable for humans reviewing your SQL.',
    exercise: {
      prompt:
        'Write a query that returns each product\'s `name` as `product_name` and `price` as `usd`, from the `products` table.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'products'],
        mustHave: ['AS', 'product_name', 'usd']
      },
      sampleAnswer: 'SELECT name AS product_name, price AS usd FROM products;'
    },
    takeaways: [
      'Column aliases (`AS new_name`) make results readable.',
      'Table aliases (`FROM customers AS c`) shorten complex queries.',
      'Aliases live only in the query — they don\'t change the actual schema.'
    ]
  },

  '2.5': {
    moduleId: '2.5',
    title: 'String functions',
    concept:
      'String functions transform text: `UPPER`/`LOWER` change case, `LENGTH` counts characters, `CONCAT` joins strings, `SUBSTRING(str, start, len)` extracts a slice.',
    tables: ['customers'],
    example: {
      sql: "-- Build a display label for each customer\nSELECT\n  UPPER(name) AS shouty_name,\n  CONCAT(name, ' (', city, ')') AS label,\n  LENGTH(email) AS email_len\nFROM customers\nLIMIT 4;",
      result: {
        columns: ['shouty_name', 'label', 'email_len'],
        rows: [
          ['AARAV MEHTA', 'Aarav Mehta (Mumbai)', 14],
          ['SOFIA REYES', 'Sofia Reyes (Madrid)', 14],
          ['KENJI TANAKA', 'Kenji Tanaka (Tokyo)', 14],
          ['PRIYA SINGH', 'Priya Singh (Delhi)', 14]
        ]
      }
    },
    insight:
      'Dialect alert: MySQL uses `CONCAT(a, b)`, PostgreSQL allows `a || b`, SQLite supports both. Use the function form for portability.',
    exercise: {
      prompt:
        'Write a query that returns each customer\'s `name` and the **lowercase** version of their email, aliased as `email_lower`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'customers'],
        mustHave: ['LOWER', 'email', 'email_lower']
      },
      sampleAnswer: 'SELECT name, LOWER(email) AS email_lower FROM customers;'
    },
    takeaways: [
      'Common string ops: `UPPER`, `LOWER`, `LENGTH`, `CONCAT`, `SUBSTRING`.',
      'Dialect differences are real — `CONCAT` vs `||` is the classic gotcha.',
      'String functions are pure: they never modify the stored data.'
    ]
  },

  '2.6': {
    moduleId: '2.6',
    title: 'Date functions',
    concept:
      'Date functions extract parts of dates (`DATE_PART(\'year\', col)`), find differences (`DATEDIFF`), and format output (`DATE_FORMAT` / `TO_CHAR`). `CURRENT_DATE` and `NOW()` give you "today" / "now".',
    tables: ['customers'],
    example: {
      sql: "-- How many days since each customer signed up\nSELECT\n  name,\n  signup_date,\n  CURRENT_DATE - signup_date AS days_active\nFROM customers\nORDER BY days_active DESC\nLIMIT 4;",
      result: {
        columns: ['name', 'signup_date', 'days_active'],
        rows: [
          ['Aarav Mehta', '2024-01-12', 850],
          ['Sofia Reyes', '2024-02-04', 827],
          ['Kenji Tanaka', '2024-02-19', 812],
          ['Priya Singh', '2024-03-08', 794]
        ]
      }
    },
    insight:
      'Dialect alert: subtracting dates returns days in PostgreSQL, an INTERVAL in some dialects, and is invalid in others. Use `DATEDIFF(d1, d2)` (MySQL) or `julianday(d1) - julianday(d2)` (SQLite) for portability.',
    exercise: {
      prompt:
        'Write a query that extracts the **signup year** from each customer\'s `signup_date` and groups customers by year. Show `signup_year` and a count called `signups`. Use `EXTRACT(YEAR FROM signup_date)` or `STRFTIME(\'%Y\', signup_date)`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'customers', 'GROUP BY'],
        mustHave: ['signup_year', 'COUNT'],
        anyOf: ['EXTRACT', 'STRFTIME', 'YEAR', 'DATE_PART']
      },
      sampleAnswer: "SELECT EXTRACT(YEAR FROM signup_date) AS signup_year, COUNT(*) AS signups FROM customers GROUP BY signup_year;"
    },
    takeaways: [
      'Dates are first-class types — use date functions, never string parsing.',
      '`EXTRACT`, `DATE_PART`, `DATEDIFF` are the common building blocks.',
      'Dialect differences are biggest with dates — always check the docs.'
    ]
  },

  /* ==================== LEVEL 3: MULTI-TABLE SQL ==================== */

  '3.1': {
    moduleId: '3.1',
    title: 'What is a JOIN?',
    concept:
      'A `JOIN` combines rows from two tables based on a related column. Imagine two Venn circles — the **intersection** is rows that match in both. Different join types control which non-matching rows you keep.',
    tables: ['customers', 'orders'],
    example: {
      sql: '-- Customers and their orders, matched by customer_id\nSELECT c.name, o.order_id, o.total_amount\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nLIMIT 5;',
      result: {
        columns: ['name', 'order_id', 'total_amount'],
        rows: [
          ['Aarav Mehta', 1001, 114.49],
          ['Aarav Mehta', 1003, 42.00],
          ['Aarav Mehta', 1010, 12.50],
          ['Sofia Reyes', 1002, 89.50],
          ['Sofia Reyes', 1008, 131.50]
        ]
      }
    },
    insight:
      'The `ON` clause is the matching condition. Without it, you get a Cartesian product — every row in A paired with every row in B. Disaster on big tables.',
    exercise: {
      prompt:
        'In your own words (free-form), explain: **what does a JOIN do, and what column do you join `customers` and `orders` on?**',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const hasCustId = t.includes('customer_id');
        const hasCombine = t.includes('combin') || t.includes('match') || t.includes('relat') || t.includes('link') || t.includes('connect') || t.includes('join');
        return { correct: hasCustId && hasCombine, feedback: hasCustId && hasCombine
          ? 'Right. A JOIN combines rows from two tables wherever a matching value exists in the shared column — here, `customer_id`.'
          : 'Hint: a JOIN **combines** or **matches** rows. The link between customers and orders is the `customer_id` column that appears in both tables.' };
      }
    },
    takeaways: [
      'JOINs combine rows from two tables on a shared column.',
      'The `ON` clause defines how rows are matched.',
      'Join types differ only in **which non-matching rows you keep**.'
    ]
  },

  '3.2': {
    moduleId: '3.2',
    title: 'INNER JOIN',
    concept:
      '`INNER JOIN` (or just `JOIN`) returns **only rows that match in both tables**. Non-matching rows on either side are dropped. It\'s the most common join.',
    tables: ['customers', 'orders'],
    example: {
      sql: '-- Every order with the customer\'s name attached\nSELECT c.name, o.order_id, o.status\nFROM customers c\nINNER JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = \'delivered\'\nLIMIT 5;',
      result: {
        columns: ['name', 'order_id', 'status'],
        rows: [
          ['Aarav Mehta', 1001, 'delivered'],
          ['Sofia Reyes', 1002, 'delivered'],
          ['Aarav Mehta', 1003, 'delivered'],
          ['Kenji Tanaka', 1004, 'delivered'],
          ['Liam Doyle', 1006, 'delivered']
        ]
      }
    },
    insight:
      'Customer 8 (Noa Cohen) has no orders, so she\'s excluded. INNER JOIN silently drops unmatched rows — be careful when you actually wanted them.',
    exercise: {
      prompt:
        'Write a query joining `orders` and `order_items` to show each `order_id` with the `product_id` and `quantity` it contains. Use INNER JOIN. Limit to 5 rows.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'INNER JOIN', 'ON'],
        mustHave: ['orders', 'order_items', 'product_id', 'quantity']
      },
      sampleAnswer: 'SELECT o.order_id, oi.product_id, oi.quantity FROM orders o INNER JOIN order_items oi ON o.order_id = oi.order_id LIMIT 5;'
    },
    takeaways: [
      '`INNER JOIN` keeps only rows matching in both tables.',
      'Always alias tables (e.g. `c` for customers) — it makes joins readable.',
      'Use it when you want **only complete pairs**.'
    ]
  },

  '3.3': {
    moduleId: '3.3',
    title: 'LEFT and RIGHT JOIN',
    concept:
      '`LEFT JOIN` keeps **all rows from the left table** and fills with NULL where the right has no match. `RIGHT JOIN` is the mirror image. Use LEFT JOIN to find "things with no related thing".',
    tables: ['customers', 'orders'],
    example: {
      sql: '-- Every customer, with their order count (0 if no orders)\nSELECT c.name, COUNT(o.order_id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.name\nORDER BY order_count DESC;',
      result: {
        columns: ['name', 'order_count'],
        rows: [
          ['Aarav Mehta', 3],
          ['Sofia Reyes', 2],
          ['Kenji Tanaka', 1],
          ['Priya Singh', 1],
          ['Liam Doyle', 1],
          ['Chen Wei', 1],
          ['Amara Okafor', 1],
          ['Noa Cohen', 0]
        ]
      }
    },
    insight:
      'LEFT JOIN + `WHERE right_col IS NULL` is the classic pattern for "find everything in A that\'s missing from B".',
    exercise: {
      prompt:
        'Write a query that returns the names of all customers who have **never placed an order**. Hint: LEFT JOIN customers to orders, then filter where `orders.order_id IS NULL`.',
      type: 'sql',
      expected: {
        keywords: ['LEFT JOIN', 'IS NULL'],
        mustHave: ['customers', 'orders', 'order_id']
      },
      sampleAnswer: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;'
    },
    takeaways: [
      '`LEFT JOIN` keeps every row from the left table; NULL fills the right.',
      'LEFT JOIN + `IS NULL` finds rows with no related record.',
      'RIGHT JOIN exists but is rarely used — just flip table order and use LEFT.'
    ]
  },

  '3.4': {
    moduleId: '3.4',
    title: 'FULL OUTER JOIN and CROSS JOIN',
    concept:
      '`FULL OUTER JOIN` keeps **all rows from both tables**, filling NULLs where there\'s no match. `CROSS JOIN` returns the **Cartesian product** — every row in A paired with every row in B. Use cross joins deliberately; they explode quickly.',
    tables: ['products', 'customers'],
    example: {
      sql: '-- Every combination of customer and product (Cartesian)\nSELECT c.name AS customer, p.name AS product\nFROM customers c\nCROSS JOIN products p\nLIMIT 5;',
      result: {
        columns: ['customer', 'product'],
        rows: [
          ['Aarav Mehta', 'Wireless Mouse'],
          ['Aarav Mehta', 'Mechanical Keyboard'],
          ['Aarav Mehta', 'Yoga Mat'],
          ['Aarav Mehta', 'Stainless Bottle'],
          ['Aarav Mehta', 'Running Shoes']
        ]
      }
    },
    insight:
      'A CROSS JOIN of 1k customers × 1k products = 1 million rows. Always know the row count BEFORE you run it on production data.',
    exercise: {
      prompt:
        'Without running it, **how many rows** will a CROSS JOIN of `customers` (8 rows) and `products` (8 rows) return? Type the number.',
      type: 'free',
      check: (input) => {
        const n = parseInt(input.trim(), 10);
        return { correct: n === 64, feedback: n === 64
          ? 'Right. 8 × 8 = 64. CROSS JOIN multiplies row counts.'
          : 'CROSS JOIN multiplies the row counts of both tables. Try again.' };
      }
    },
    takeaways: [
      '`FULL OUTER JOIN` = all rows from both sides, NULL where no match.',
      '`CROSS JOIN` = every row × every row. Use carefully.',
      'SQLite and older MySQL don\'t support FULL OUTER — simulate with `LEFT UNION RIGHT`.'
    ]
  },

  '3.5': {
    moduleId: '3.5',
    title: 'Self-joins',
    concept:
      'A self-join joins a table to itself — useful for hierarchical data (employees and managers) or "find pairs in the same table". You **must** use aliases to distinguish the two copies.',
    tables: ['employees'],
    example: {
      sql: '-- Employees with their manager\'s name\nSELECT\n  e.name AS employee,\n  m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.employee_id\nORDER BY manager NULLS LAST;',
      result: {
        columns: ['employee', 'manager'],
        rows: [
          ['Marcus Lee',   'Diana Park'],
          ['Yuki Sato',    'Diana Park'],
          ['Tomas Novak',  'Elena Rossi'],
          ['Aisha Khan',   'Elena Rossi'],
          ['Carla Mendes', 'Hiroshi Mori'],
          ['Diana Park',   null],
          ['Elena Rossi',  null],
          ['Hiroshi Mori', null]
        ]
      }
    },
    insight:
      'LEFT JOIN here matters: an INNER JOIN would drop the top-level managers (who have no manager themselves).',
    exercise: {
      prompt:
        'Write a self-join that returns each manager\'s name and **how many direct reports they have**. Use `employees` joined to itself. Hint: GROUP BY the manager.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'employees', 'JOIN', 'GROUP BY'],
        mustHave: ['employee_id', 'manager_id', 'COUNT']
      },
      sampleAnswer: 'SELECT m.name AS manager, COUNT(e.employee_id) AS direct_reports FROM employees m JOIN employees e ON e.manager_id = m.employee_id GROUP BY m.name;'
    },
    takeaways: [
      'Self-joins join a table to itself; aliases are mandatory.',
      'Perfect for hierarchies (employees/managers, categories/subcategories).',
      'Use LEFT JOIN if you want to include rows with no related row.'
    ]
  },

  '3.6': {
    moduleId: '3.6',
    title: 'Subqueries',
    concept:
      'A subquery is a query inside another query, wrapped in parentheses. They appear in `SELECT`, `FROM`, or `WHERE` clauses. Common use: filter against an aggregated value.',
    tables: ['products'],
    example: {
      sql: '-- Products priced above the average\nSELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);',
      result: {
        columns: ['name', 'price'],
        rows: [
          ['Mechanical Keyboard', 89.50],
          ['Running Shoes', 119.00],
          ['Bluetooth Speaker', 64.00]
        ]
      }
    },
    insight:
      'Most subqueries can be rewritten as JOINs or CTEs. Subqueries in `WHERE` are fine; subqueries in `SELECT` running per row are usually a performance trap.',
    exercise: {
      prompt:
        'Write a query that returns the names of customers who are **older than the average customer age**. Use a subquery in the WHERE clause.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'customers', 'WHERE'],
        mustHave: ['AVG', 'age'],
        regex: /\(\s*select\s+avg/i
      },
      sampleAnswer: 'SELECT name FROM customers WHERE age > (SELECT AVG(age) FROM customers);'
    },
    takeaways: [
      'Subqueries are queries wrapped in parentheses inside another query.',
      'Most common spot: `WHERE col op (SELECT ...)`.',
      'Be wary of subqueries that re-execute per row — they kill performance.'
    ]
  },

  '3.7': {
    moduleId: '3.7',
    title: 'CTEs (WITH clause)',
    concept:
      'A CTE (Common Table Expression) is a named subquery defined with `WITH`. CTEs make multi-step logic readable and let you reference the same intermediate result multiple times.',
    tables: ['orders'],
    example: {
      sql: '-- Customers and their order count, plus their rank\nWITH customer_orders AS (\n  SELECT customer_id, COUNT(*) AS order_count\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT *\nFROM customer_orders\nWHERE order_count >= 2\nORDER BY order_count DESC;',
      result: {
        columns: ['customer_id', 'order_count'],
        rows: [[1, 3], [2, 2]]
      }
    },
    insight:
      'Read a CTE top-down like a recipe: "first compute X, then use X to compute Y, then return Y." Far more readable than nested subqueries.',
    exercise: {
      prompt:
        'Write a CTE called `high_value_orders` that selects orders with `total_amount > 100`, then in the main query return the count of those orders.',
      type: 'sql',
      expected: {
        keywords: ['WITH', 'AS', 'SELECT', 'FROM'],
        mustHave: ['high_value_orders', 'COUNT'],
        regex: /total_amount\s*>\s*100/i
      },
      sampleAnswer: 'WITH high_value_orders AS (SELECT * FROM orders WHERE total_amount > 100) SELECT COUNT(*) AS count FROM high_value_orders;'
    },
    takeaways: [
      '`WITH name AS (...)` defines a named subquery — a CTE.',
      'CTEs make multi-step queries readable and reusable within a statement.',
      'They\'re queries, not stored objects — they vanish after the query runs.'
    ]
  },

  /* ==================== LEVEL 4: ADVANCED SQL ==================== */

  '4.1': {
    moduleId: '4.1',
    title: 'Window functions',
    concept:
      'Window functions calculate a value across a set of rows **without collapsing them** like GROUP BY does. `ROW_NUMBER`, `RANK`, `DENSE_RANK` assign positions within a partition.',
    tables: ['products'],
    example: {
      sql: '-- Rank products by price within each category\nSELECT\n  category,\n  name,\n  price,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank\nFROM products;',
      result: {
        columns: ['category', 'name', 'price', 'price_rank'],
        rows: [
          ['Electronics', 'Mechanical Keyboard', 89.50, 1],
          ['Electronics', 'Bluetooth Speaker',   64.00, 2],
          ['Electronics', 'Wireless Mouse',      24.99, 3],
          ['Fitness',     'Running Shoes',      119.00, 1],
          ['Fitness',     'Yoga Mat',            29.00, 2],
          ['Home',        'Desk Lamp',           42.00, 1],
          ['Kitchen',     'Stainless Bottle',    18.75, 1],
          ['Stationery',  'Notebook Set',        12.50, 1]
        ]
      }
    },
    insight:
      '`ROW_NUMBER` always gives unique integers (1,2,3). `RANK` skips after ties (1,1,3). `DENSE_RANK` doesn\'t skip (1,1,2). Pick based on what "tie behavior" you want.',
    exercise: {
      prompt:
        'Using `employees`, write a query that returns each employee\'s `name`, `salary`, `department`, and their **salary rank within their department** (highest = 1). Call the rank `dept_rank`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'employees', 'OVER', 'PARTITION BY'],
        mustHave: ['salary', 'department', 'dept_rank'],
        anyOf: ['ROW_NUMBER', 'RANK', 'DENSE_RANK']
      },
      sampleAnswer: 'SELECT name, salary, department, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;'
    },
    takeaways: [
      'Window functions add a column based on a "window" of rows — without collapsing them.',
      '`PARTITION BY` defines the window; `ORDER BY` defines the order within it.',
      'Use `ROW_NUMBER` / `RANK` / `DENSE_RANK` for "top N per group" queries.'
    ]
  },

  '4.2': {
    moduleId: '4.2',
    title: 'Window frames',
    concept:
      'Inside an `OVER()` you can define a **frame** — a sliding window of rows. The frame controls which rows are visible to aggregates like `SUM` or `AVG`. Default frame for ordered windows is "rows from start of partition to current row".',
    tables: ['orders'],
    example: {
      sql: '-- Running total of order amounts over time\nSELECT\n  order_id,\n  order_date,\n  total_amount,\n  SUM(total_amount) OVER (ORDER BY order_date) AS running_total\nFROM orders\nORDER BY order_date;',
      result: {
        columns: ['order_id', 'order_date', 'total_amount', 'running_total'],
        rows: [
          [1001, '2024-03-15', 114.49, 114.49],
          [1002, '2024-03-22', 89.50, 203.99],
          [1003, '2024-04-02', 42.00, 245.99],
          [1004, '2024-04-18', 148.00, 393.99],
          [1005, '2024-05-05', 24.99, 418.98]
        ]
      }
    },
    insight:
      'Running totals, moving averages, percentage-of-total — all are window-frame tricks. They were a nightmare before window functions; now they\'re one line.',
    exercise: {
      prompt:
        'Write a query showing each customer\'s `customer_id`, `total_amount`, and a column called `pct_of_total` showing what **percent** of total revenue this order represents. Hint: divide `total_amount` by `SUM(total_amount) OVER ()`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'orders', 'OVER'],
        mustHave: ['SUM', 'total_amount', 'pct_of_total']
      },
      sampleAnswer: 'SELECT customer_id, total_amount, ROUND(100.0 * total_amount / SUM(total_amount) OVER (), 2) AS pct_of_total FROM orders;'
    },
    takeaways: [
      'Frames define which rows an aggregate window sees.',
      '`SUM(x) OVER (ORDER BY y)` is a running total; `OVER ()` is the grand total.',
      'Use frames for running totals, moving averages, percent-of-total.'
    ]
  },

  '4.3': {
    moduleId: '4.3',
    title: 'LAG and LEAD',
    concept:
      '`LAG(col, n)` returns the value `n` rows **before** the current row; `LEAD(col, n)` returns `n` rows **after**. Both need an `ORDER BY` inside `OVER()`. Perfect for comparing rows to neighbors.',
    tables: ['orders'],
    example: {
      sql: '-- Difference between each order and the previous one\nSELECT\n  order_id,\n  order_date,\n  total_amount,\n  LAG(total_amount) OVER (ORDER BY order_date) AS prev_amount,\n  total_amount - LAG(total_amount) OVER (ORDER BY order_date) AS change\nFROM orders\nORDER BY order_date\nLIMIT 5;',
      result: {
        columns: ['order_id', 'order_date', 'total_amount', 'prev_amount', 'change'],
        rows: [
          [1001, '2024-03-15', 114.49, null, null],
          [1002, '2024-03-22', 89.50, 114.49, -24.99],
          [1003, '2024-04-02', 42.00, 89.50, -47.50],
          [1004, '2024-04-18', 148.00, 42.00, 106.00],
          [1005, '2024-05-05', 24.99, 148.00, -123.01]
        ]
      }
    },
    insight:
      'LAG/LEAD on time-series data is the #1 way to compute "delta from previous period" without self-joins.',
    exercise: {
      prompt:
        'Write a query showing each order\'s `order_id`, `order_date`, `total_amount`, and a column `next_amount` containing the **next** order\'s amount, ordered by `order_date`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'orders', 'OVER'],
        mustHave: ['LEAD', 'total_amount', 'next_amount']
      },
      sampleAnswer: 'SELECT order_id, order_date, total_amount, LEAD(total_amount) OVER (ORDER BY order_date) AS next_amount FROM orders;'
    },
    takeaways: [
      '`LAG(col)` looks back; `LEAD(col)` looks forward.',
      'Both require `OVER (ORDER BY ...)`.',
      'Boundary rows get NULL — no previous/next exists.'
    ]
  },

  '4.4': {
    moduleId: '4.4',
    title: 'CASE WHEN',
    concept:
      '`CASE WHEN` is SQL\'s if/else. It evaluates conditions top-down and returns the first match. Use it inside SELECT, WHERE, ORDER BY, or aggregates for conditional logic.',
    tables: ['products'],
    example: {
      sql: "-- Tag products by price bracket\nSELECT\n  name,\n  price,\n  CASE\n    WHEN price < 25  THEN 'budget'\n    WHEN price < 75  THEN 'mid-range'\n    ELSE 'premium'\n  END AS price_tier\nFROM products;",
      result: {
        columns: ['name', 'price', 'price_tier'],
        rows: [
          ['Wireless Mouse',      24.99, 'budget'],
          ['Mechanical Keyboard', 89.50, 'premium'],
          ['Yoga Mat',            29.00, 'mid-range'],
          ['Stainless Bottle',    18.75, 'budget'],
          ['Running Shoes',      119.00, 'premium'],
          ['Desk Lamp',           42.00, 'mid-range'],
          ['Notebook Set',        12.50, 'budget'],
          ['Bluetooth Speaker',   64.00, 'mid-range']
        ]
      }
    },
    insight:
      'CASE WHEN inside `SUM` is a powerful pattern: `SUM(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END)` counts a subset without filtering the whole query.',
    exercise: {
      prompt:
        'Write a query categorizing customers by age into buckets: `<30 = \'young\'`, `30-50 = \'middle\'`, `>50 = \'senior\'`. Return `name`, `age`, and `age_group`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'customers', 'CASE', 'WHEN', 'THEN', 'END'],
        mustHave: ['age', 'age_group']
      },
      sampleAnswer: "SELECT name, age, CASE WHEN age < 30 THEN 'young' WHEN age <= 50 THEN 'middle' ELSE 'senior' END AS age_group FROM customers;"
    },
    takeaways: [
      '`CASE WHEN cond THEN val ... ELSE val END` is SQL\'s if/else.',
      'Conditions are evaluated top-down; first match wins.',
      'Pair with aggregates for conditional counting/summing.'
    ]
  },

  '4.5': {
    moduleId: '4.5',
    title: 'EXISTS and NOT EXISTS',
    concept:
      '`EXISTS (subquery)` returns true if the subquery produces **at least one row**. Often faster than `IN` and clearer than LEFT JOIN + IS NULL. `NOT EXISTS` is the negation.',
    tables: ['customers', 'orders'],
    example: {
      sql: '-- Customers who have placed at least one order\nSELECT name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);',
      result: {
        columns: ['name'],
        rows: [
          ['Aarav Mehta'], ['Sofia Reyes'], ['Kenji Tanaka'],
          ['Priya Singh'], ['Liam Doyle'], ['Chen Wei'], ['Amara Okafor']
        ]
      }
    },
    insight:
      'Inside EXISTS, the SELECT list doesn\'t matter — most people write `SELECT 1`. The DB only checks if **any** row exists.',
    exercise: {
      prompt:
        'Write a query that returns the names of customers who have **never** placed an order, using `NOT EXISTS`.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'customers', 'NOT EXISTS'],
        mustHave: ['orders', 'customer_id']
      },
      sampleAnswer: 'SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);'
    },
    takeaways: [
      '`EXISTS (subq)` is true if the subquery returns any row.',
      'Use `SELECT 1` inside EXISTS — the column list is ignored.',
      'NOT EXISTS is the cleanest way to express "find rows with no matching child".'
    ]
  },

  '4.6': {
    moduleId: '4.6',
    title: 'UNION, INTERSECT, EXCEPT',
    concept:
      'Set operators combine results from two `SELECT` statements with matching columns. `UNION` = combine and dedupe, `UNION ALL` = combine and keep duplicates, `INTERSECT` = rows in both, `EXCEPT` (or `MINUS`) = rows in first but not second.',
    tables: ['customers', 'employees'],
    example: {
      sql: "-- Every city that appears in either customers or employees\nSELECT city AS location FROM customers\nUNION\nSELECT 'HQ' AS location\nORDER BY location\nLIMIT 5;",
      result: {
        columns: ['location'],
        rows: [['Delhi'], ['Dublin'], ['HQ'], ['Lagos'], ['Madrid']]
      }
    },
    insight:
      'Both SELECTs must have the **same number of columns** with **compatible types**. UNION dedupes (slower); UNION ALL keeps duplicates (faster). Prefer ALL unless you actually need dedupe.',
    exercise: {
      prompt:
        'Use `UNION ALL` to combine the `name` column from `customers` with the `name` column from `employees`, ordered alphabetically. Limit to 10 rows.',
      type: 'sql',
      expected: {
        keywords: ['SELECT', 'FROM', 'UNION ALL', 'ORDER BY', 'LIMIT'],
        mustHave: ['customers', 'employees', 'name']
      },
      sampleAnswer: 'SELECT name FROM customers UNION ALL SELECT name FROM employees ORDER BY name LIMIT 10;'
    },
    takeaways: [
      'Set operators combine results from two SELECTs.',
      'Columns must match in number and type.',
      '`UNION ALL` > `UNION` for performance when dedupe isn\'t needed.'
    ]
  },

  '4.7': {
    moduleId: '4.7',
    title: 'Indexes',
    concept:
      'An index is a data structure (usually a B-tree) that lets the database **find rows fast** without scanning the whole table. Indexes speed up SELECT/WHERE/JOIN — but slow down INSERT/UPDATE/DELETE because they have to be kept in sync.',
    tables: ['customers'],
    example: {
      sql: '-- Create an index on email for fast lookups\nCREATE INDEX idx_customers_email ON customers(email);\n\n-- Now this query uses the index (lookup, not scan)\nSELECT * FROM customers WHERE email = \'aarav@mail.com\';',
      result: {
        columns: ['Note'],
        rows: [['Without index: scans all 8 rows. With index: jumps straight to the row in ~log(n) steps.']]
      }
    },
    insight:
      'Index every column you frequently filter or JOIN on. **Don\'t** index everything — indexes cost space and slow writes. Primary keys are indexed automatically.',
    exercise: {
      prompt:
        'You frequently run queries like `SELECT * FROM orders WHERE customer_id = ? AND order_date > ?`. **Which column(s) should you index, and why?** (Free-form answer.)',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const hasCust = t.includes('customer_id');
        const hasDate = t.includes('order_date') || t.includes('date');
        return { correct: hasCust && hasDate, feedback: hasCust && hasDate
          ? 'Right. A **composite index** on `(customer_id, order_date)` is ideal — it speeds up both the filter and the range scan in one structure.'
          : 'Hint: any column that appears in `WHERE` is a candidate. Both filters in the query are good candidates for a composite index.' };
      }
    },
    takeaways: [
      'Indexes make reads fast and writes slower.',
      'Index columns that appear in WHERE, JOIN, or ORDER BY.',
      'A composite index `(a, b)` covers queries filtering on `a` or `a AND b`, but not `b` alone.'
    ]
  },

  /* ==================== LEVEL 5: REAL-WORLD SQL ==================== */

  '5.1': {
    moduleId: '5.1',
    title: 'Database design & normalization',
    concept:
      'Normalization splits data into multiple tables to remove redundancy. **1NF** = atomic values (no lists in cells). **2NF** = no partial dependencies on composite keys. **3NF** = no transitive dependencies (non-key columns depend only on the key). **Foreign keys** enforce that references between tables stay valid.',
    tables: ['orders', 'order_items'],
    example: {
      sql: "-- Bad: order info repeated for each item (denormalized)\n-- order_id | customer_name | product_name | qty\n\n-- Good: split into orders and order_items (3NF)\nCREATE TABLE orders (\n  order_id INT PRIMARY KEY,\n  customer_id INT REFERENCES customers(customer_id),\n  order_date DATE\n);\n\nCREATE TABLE order_items (\n  item_id INT PRIMARY KEY,\n  order_id INT REFERENCES orders(order_id),\n  product_id INT REFERENCES products(product_id),\n  quantity INT\n);",
      result: {
        columns: ['Principle'],
        rows: [['No data repeated. Updates happen in one place. Foreign keys keep references valid.']]
      }
    },
    insight:
      'In analytics workloads, deliberate **denormalization** (e.g. star schemas) is often the right call — it trades write complexity for read speed. Normalization is a tool, not a religion.',
    exercise: {
      prompt:
        'A `products` table has columns `(id, name, category_id, category_name, category_description)`. **Which normal form does this violate, and how would you fix it?** (Free-form answer.)',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const hits3nf = t.includes('3nf') || t.includes('third normal') || t.includes('transitive');
        const fix = t.includes('separate') || t.includes('split') || t.includes('categor') || t.includes('foreign');
        return { correct: hits3nf || fix, feedback: hits3nf && fix
          ? 'Exactly. `category_name` and `category_description` depend on `category_id`, not on the product\'s primary key — a transitive dependency violating 3NF. Fix: split categories into their own table and reference by `category_id`.'
          : 'Hint: `category_name` depends on `category_id`, not on the product\'s primary key. That\'s a transitive dependency — a 3NF violation. The fix is to extract a separate `categories` table.' };
      }
    },
    takeaways: [
      'Normalization removes redundancy: 1NF → 2NF → 3NF.',
      'Foreign keys enforce referential integrity between tables.',
      'Denormalize deliberately, for measured read-performance gains.'
    ]
  },

  '5.2': {
    moduleId: '5.2',
    title: 'Transactions & ACID',
    concept:
      'A transaction is a group of statements that succeed or fail as a unit. `BEGIN`, `COMMIT`, `ROLLBACK`. **ACID** = Atomicity (all-or-nothing), Consistency (valid state to valid state), Isolation (concurrent transactions don\'t see each other\'s in-progress changes), Durability (committed changes survive crashes).',
    tables: ['orders'],
    example: {
      sql: "-- Transfer money atomically — either both happen or neither\nBEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- If anything failed above, undo it all:\n-- ROLLBACK;\n\n-- Otherwise persist:\nCOMMIT;",
      result: {
        columns: ['Guarantee'],
        rows: [['Either both updates succeed (COMMIT) or neither does (ROLLBACK). No half-state possible.']]
      }
    },
    insight:
      'The classic bug: forgetting that an error mid-transaction does NOT auto-rollback in all clients. Always wrap risky multi-statement work in `BEGIN ... COMMIT` with explicit error handling.',
    exercise: {
      prompt:
        'Name the four ACID properties (free-form, in any order).',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const props = ['atomic', 'consist', 'isolat', 'durab'];
        const hit = props.filter(p => t.includes(p)).length;
        return { correct: hit === 4, feedback: hit === 4
          ? 'All four. Atomicity, Consistency, Isolation, Durability — the guarantees that make databases trustworthy under concurrency and failure.'
          : `You got ${hit}/4. The four are **A**tomicity, **C**onsistency, **I**solation, **D**urability.` };
      }
    },
    takeaways: [
      'Transactions: `BEGIN → ... → COMMIT/ROLLBACK`. All or nothing.',
      'ACID = Atomicity, Consistency, Isolation, Durability.',
      'Wrap any multi-statement state change in a transaction.'
    ]
  },

  '5.3': {
    moduleId: '5.3',
    title: 'Views & Materialized Views',
    concept:
      'A **view** is a saved query you can SELECT from like a table — but it runs the underlying query every time. A **materialized view** stores the result physically and must be `REFRESH`ed to update. Use views for simplification; materialized views for cached expensive aggregates.',
    tables: ['orders'],
    example: {
      sql: "-- Create a view that gives a clean per-customer summary\nCREATE VIEW customer_summary AS\nSELECT\n  customer_id,\n  COUNT(*) AS order_count,\n  SUM(total_amount) AS lifetime_value\nFROM orders\nGROUP BY customer_id;\n\n-- Use it like a table\nSELECT * FROM customer_summary WHERE lifetime_value > 100;",
      result: {
        columns: ['customer_id', 'order_count', 'lifetime_value'],
        rows: [[1, 3, 168.99], [2, 2, 221.00], [3, 1, 148.00], [5, 1, 250.00]]
      }
    },
    insight:
      'Views are free (just query rewriting). Materialized views are storage + maintenance trade-offs. PostgreSQL supports both; MySQL only supports plain views.',
    exercise: {
      prompt:
        'In one sentence (free-form): **what\'s the key difference between a view and a materialized view?**',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const ok = (t.includes('stor') || t.includes('cach') || t.includes('save')) && (t.includes('material'));
        return { correct: ok, feedback: ok
          ? 'Right. A view re-runs its query every time you select from it. A materialized view stores the result, so reads are fast — at the cost of needing periodic refreshes.'
          : 'Hint: one re-runs the query each time, the other physically stores the result.' };
      }
    },
    takeaways: [
      'Views = saved queries, recomputed on every read.',
      'Materialized views = stored result, refreshed manually or on schedule.',
      'Use views for abstraction; materialized views for caching expensive joins/aggregates.'
    ]
  },

  '5.4': {
    moduleId: '5.4',
    title: 'Stored procedures & functions',
    concept:
      'Stored procedures and functions are reusable code stored in the database. **Functions** return a value and can be used in queries (`SELECT my_fn(x)`). **Procedures** are called with `CALL` and can perform multi-statement work (like transactions). They reduce network round-trips and centralize logic.',
    tables: ['orders'],
    example: {
      sql: "-- A function that returns lifetime value for a customer\nCREATE FUNCTION customer_ltv(cid INT) RETURNS DECIMAL AS $$\n  SELECT COALESCE(SUM(total_amount), 0)\n  FROM orders\n  WHERE customer_id = cid;\n$$ LANGUAGE SQL;\n\n-- Use it inline\nSELECT name, customer_ltv(customer_id) AS ltv\nFROM customers\nORDER BY ltv DESC;",
      result: {
        columns: ['name', 'ltv'],
        rows: [
          ['Liam Doyle', 250.00],
          ['Sofia Reyes', 221.00],
          ['Aarav Mehta', 168.99],
          ['Kenji Tanaka', 148.00]
        ]
      }
    },
    insight:
      'Stored procedures were huge in the 90s/2000s; modern apps often prefer logic in the application layer for testability and version control. But for performance-critical hot loops, they\'re still king.',
    exercise: {
      prompt:
        'When would you use a **stored procedure** over equivalent application code? (Free-form, name one good reason.)',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const reasons = ['performance','network','round','round-trip','consist','reuse','data','atomic','transaction','security','bulk'];
        const hit = reasons.some(r => t.includes(r));
        return { correct: hit, feedback: hit
          ? 'Good. Common reasons: fewer network round-trips, centralized data-access logic, atomic multi-statement work, and centralized security policies.'
          : 'Hint: think about network round-trips, atomicity across many statements, or sharing logic between multiple applications.' };
      }
    },
    takeaways: [
      'Functions return values; procedures perform actions.',
      'They eliminate network round-trips for multi-step DB work.',
      'Modern preference: app-layer logic for testability, DB for hot paths.'
    ]
  },

  '5.5': {
    moduleId: '5.5',
    title: 'Query optimization & EXPLAIN',
    concept:
      '`EXPLAIN` (or `EXPLAIN ANALYZE`) shows the database\'s **execution plan** — what it will do to run your query. Look for sequential scans on big tables (need an index?), nested loops on large inputs (need a hash join?), and bad row estimates (need updated statistics?).',
    tables: ['orders'],
    example: {
      sql: "-- See how PostgreSQL plans to run this query\nEXPLAIN ANALYZE\nSELECT c.name, SUM(o.total_amount) AS total\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.name;",
      result: {
        columns: ['Plan node'],
        rows: [
          ['HashAggregate  (cost=12.45..14.45 rows=8) (actual time=0.12..0.13)'],
          ['  -> Hash Join  (cost=1.18..12.30 rows=10) (actual time=0.05..0.10)'],
          ['        Hash Cond: (o.customer_id = c.customer_id)'],
          ['        -> Seq Scan on orders o  (rows=10)'],
          ['        -> Hash  (rows=8)'],
          ['              -> Seq Scan on customers c  (rows=8)']
        ]
      }
    },
    insight:
      'The single biggest win: add an index on any column you JOIN or filter on. Second biggest: avoid `SELECT *` and pull only what you need. Third: filter early (push WHERE conditions as deep as possible).',
    exercise: {
      prompt:
        'EXPLAIN shows your query does a `Seq Scan on orders` filtering on `customer_id`. The table has 10 million rows. **What\'s the single most impactful fix?**',
      type: 'free',
      check: (input) => {
        const t = input.toLowerCase();
        const ok = t.includes('index') && t.includes('customer_id');
        return { correct: ok, feedback: ok
          ? 'Exactly. `CREATE INDEX idx_orders_customer ON orders(customer_id);` will turn the seq scan into a fast index lookup.'
          : 'Hint: a sequential scan on 10M rows for one customer is doing way too much work. What structure makes lookups by `customer_id` fast?' };
      }
    },
    takeaways: [
      '`EXPLAIN ANALYZE` shows the actual execution plan.',
      'Watch for seq scans on big tables and unexpected nested loops.',
      'The top three wins: index frequently-filtered columns, avoid SELECT *, filter early.'
    ]
  },

  '5.6': {
    moduleId: '5.6',
    title: 'Capstone: e-commerce schema + 10 queries',
    concept:
      'You\'ve learned every core SQL skill. Time to apply them. The capstone has two parts: **design a schema** for an extended e-commerce platform (add reviews, categories, addresses), and **write 10 production-grade queries** answering real business questions.',
    tables: ['customers', 'orders', 'products', 'order_items', 'employees'],
    example: {
      sql: "-- Capstone Query #1: Top 5 customers by lifetime value\nWITH ltv AS (\n  SELECT customer_id, SUM(total_amount) AS lifetime_value\n  FROM orders\n  WHERE status = 'delivered'\n  GROUP BY customer_id\n)\nSELECT c.name, c.city, ltv.lifetime_value\nFROM customers c\nJOIN ltv ON c.customer_id = ltv.customer_id\nORDER BY ltv.lifetime_value DESC\nLIMIT 5;",
      result: {
        columns: ['name', 'city', 'lifetime_value'],
        rows: [
          ['Sofia Reyes', 'Madrid', 221.00],
          ['Aarav Mehta', 'Mumbai', 168.99],
          ['Kenji Tanaka', 'Tokyo', 148.00],
          ['Liam Doyle', 'Dublin', 250.00]
        ]
      }
    },
    insight:
      'Real-world SQL is almost never one clean SELECT. It\'s CTEs stitching together filtered subsets, with window functions for rankings and CASE WHEN for business rules. You now have every piece.',
    exercise: {
      prompt:
        'Write a query answering: **"What is the best-selling product in each category by total quantity sold?"** Use a CTE + window function. Show `category`, `product_name`, and `total_qty`.',
      type: 'sql',
      expected: {
        keywords: ['WITH', 'OVER', 'PARTITION BY', 'JOIN'],
        mustHave: ['category', 'SUM', 'quantity']
      },
      sampleAnswer:
        "WITH ranked AS (\n  SELECT p.category, p.name AS product_name, SUM(oi.quantity) AS total_qty,\n    RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rnk\n  FROM order_items oi\n  JOIN products p ON oi.product_id = p.product_id\n  GROUP BY p.category, p.name\n)\nSELECT category, product_name, total_qty FROM ranked WHERE rnk = 1;"
    },
    takeaways: [
      'Real SQL combines every skill: CTEs, joins, aggregates, windows.',
      'Always break big problems into smaller named CTE steps.',
      'You\'re now a SQLSENSEI graduate. 🥋'
    ]
  }
};

/* ============================================
   Checkpoint quizzes (one per level)
   3 questions: recall, apply, debug
   ============================================ */

window.QUIZZES = {
  1: {
    levelNumber: 1,
    title: 'Level 1 Checkpoint — Foundations',
    questions: [
      {
        type: 'sql',
        kind: 'Recall',
        prompt: 'Write a query that returns **all columns** for every customer in `customers`.',
        expected: { mustHave: ['SELECT', '*', 'FROM', 'customers'] },
        sampleAnswer: 'SELECT * FROM customers;'
      },
      {
        type: 'sql',
        kind: 'Apply',
        prompt: 'Return the 3 cheapest products (name + price) sorted from cheapest to most expensive.',
        expected: { mustHave: ['SELECT', 'FROM', 'products', 'ORDER BY', 'LIMIT', 'price'], regex: /limit\s+3/i },
        sampleAnswer: 'SELECT name, price FROM products ORDER BY price ASC LIMIT 3;'
      },
      {
        type: 'free',
        kind: 'Debug',
        prompt: "What's wrong with this query? Explain the fix.\n\n```sql\nSELECT name FROM customers WHERE manager_id = NULL;\n```",
        check: (input) => {
          const t = input.toLowerCase();
          const ok = t.includes('is null');
          return { correct: ok, feedback: ok
            ? 'Right. `= NULL` never returns true — it evaluates to NULL itself. The fix is `WHERE manager_id IS NULL`.'
            : 'Hint: comparing anything to NULL with `=` always returns NULL (not true). What\'s the correct operator?' };
        }
      }
    ]
  },
  2: {
    levelNumber: 2,
    title: 'Level 2 Checkpoint — Shaping Data',
    questions: [
      {
        type: 'sql',
        kind: 'Recall',
        prompt: 'Count how many orders are in the `orders` table.',
        expected: { mustHave: ['SELECT', 'COUNT', 'FROM', 'orders'] },
        sampleAnswer: 'SELECT COUNT(*) FROM orders;'
      },
      {
        type: 'sql',
        kind: 'Apply',
        prompt: 'For each `category` in `products`, return the category name and **average price**, but only include categories where the average price is above 30. Sort by average price descending.',
        expected: { mustHave: ['SELECT', 'FROM', 'products', 'GROUP BY', 'HAVING', 'AVG'], regex: />\s*30/ },
        sampleAnswer: 'SELECT category, AVG(price) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 30 ORDER BY avg_price DESC;'
      },
      {
        type: 'free',
        kind: 'Debug',
        prompt: "What's wrong with this query? Explain the fix.\n\n```sql\nSELECT customer_id, name, COUNT(*) FROM orders GROUP BY customer_id;\n```",
        check: (input) => {
          const t = input.toLowerCase();
          const ok = t.includes('name') && (t.includes('group') || t.includes('aggregat'));
          return { correct: ok, feedback: ok
            ? 'Right. `name` isn\'t in `GROUP BY` and isn\'t aggregated — most engines reject this. Fix: add `name` to GROUP BY, or remove it from SELECT.'
            : 'Hint: there\'s a column in SELECT that isn\'t in GROUP BY and isn\'t inside an aggregate. Which one?' };
        }
      }
    ]
  },
  3: {
    levelNumber: 3,
    title: 'Level 3 Checkpoint — Multi-Table SQL',
    questions: [
      {
        type: 'sql',
        kind: 'Recall',
        prompt: 'INNER JOIN `customers` to `orders` on `customer_id` and return the customer name and order_id. Limit to 3 rows.',
        expected: { mustHave: ['SELECT', 'FROM', 'JOIN', 'ON', 'customer_id', 'order_id', 'LIMIT'] },
        sampleAnswer: 'SELECT c.name, o.order_id FROM customers c JOIN orders o ON c.customer_id = o.customer_id LIMIT 3;'
      },
      {
        type: 'sql',
        kind: 'Apply',
        prompt: 'Use a CTE to find products that have never been ordered. Return product name and price.',
        expected: { keywords: ['WITH', 'AS', 'NOT IN'], mustHave: ['products', 'order_items', 'product_id'], anyOf: ['NOT IN', 'NOT EXISTS', 'LEFT JOIN'] },
        sampleAnswer: 'WITH ordered AS (SELECT DISTINCT product_id FROM order_items) SELECT name, price FROM products WHERE product_id NOT IN (SELECT product_id FROM ordered);'
      },
      {
        type: 'free',
        kind: 'Debug',
        prompt: "What's wrong with this query and what's the fix?\n\n```sql\nSELECT c.name, o.total_amount\nFROM customers c, orders o;\n```",
        check: (input) => {
          const t = input.toLowerCase();
          const ok = t.includes('cartesian') || t.includes('cross') || t.includes('on ') || t.includes('join condition') || t.includes('where');
          return { correct: ok, feedback: ok
            ? 'Right. Missing join condition produces a Cartesian product — every customer paired with every order. Fix: add `WHERE c.customer_id = o.customer_id` or rewrite as `INNER JOIN ... ON`.'
            : 'Hint: there\'s no relationship specified between the two tables. What does SQL do when two tables are referenced without a join condition?' };
        }
      }
    ]
  },
  4: {
    levelNumber: 4,
    title: 'Level 4 Checkpoint — Advanced SQL',
    questions: [
      {
        type: 'sql',
        kind: 'Recall',
        prompt: 'Using a window function, assign a row number to each employee within their department, ordered by salary descending. Return name, department, salary, and the row number as `dept_rank`.',
        expected: { keywords: ['SELECT', 'FROM', 'OVER', 'PARTITION BY'], mustHave: ['ROW_NUMBER', 'dept_rank'] },
        sampleAnswer: 'SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;'
      },
      {
        type: 'sql',
        kind: 'Apply',
        prompt: 'Use CASE WHEN to label each order: amount < 50 = `\'small\'`, 50-150 = `\'medium\'`, > 150 = `\'large\'`. Return order_id, total_amount, and `size`.',
        expected: { keywords: ['SELECT', 'FROM', 'CASE', 'WHEN', 'THEN', 'END'], mustHave: ['total_amount', 'size'] },
        sampleAnswer: "SELECT order_id, total_amount, CASE WHEN total_amount < 50 THEN 'small' WHEN total_amount <= 150 THEN 'medium' ELSE 'large' END AS size FROM orders;"
      },
      {
        type: 'free',
        kind: 'Debug',
        prompt: "This query is slow on a huge orders table. What's the most likely fix?\n\n```sql\nSELECT * FROM orders WHERE customer_id = 12345;\n```",
        check: (input) => {
          const t = input.toLowerCase();
          const ok = t.includes('index') && (t.includes('customer_id') || t.includes('customer'));
          return { correct: ok, feedback: ok
            ? 'Right. Without an index on `customer_id`, this scans the entire table. `CREATE INDEX idx_orders_customer ON orders(customer_id);` turns it into a fast lookup.'
            : 'Hint: this is doing a sequential scan on the whole table. What structure makes filters on a specific column fast?' };
        }
      }
    ]
  },
  5: {
    levelNumber: 5,
    title: 'Level 5 Checkpoint — Production Readiness',
    questions: [
      {
        type: 'free',
        kind: 'Recall',
        prompt: 'Name the four ACID properties of a database transaction.',
        check: (input) => {
          const t = input.toLowerCase();
          const props = ['atomic','consist','isolat','durab'];
          const hit = props.filter(p => t.includes(p)).length;
          return { correct: hit === 4, feedback: hit === 4
            ? 'All four. ACID is the contract that lets you trust a database under concurrency and failure.'
            : `Got ${hit}/4. Hint: ACID.` };
        }
      },
      {
        type: 'sql',
        kind: 'Apply',
        prompt: 'Create a view `top_customers` that returns customers with lifetime value > $100, including their name, city, and lifetime value.',
        expected: { keywords: ['CREATE VIEW', 'SELECT', 'FROM', 'JOIN', 'GROUP BY'], mustHave: ['top_customers', 'SUM', 'total_amount'] },
        sampleAnswer: 'CREATE VIEW top_customers AS SELECT c.name, c.city, SUM(o.total_amount) AS lifetime_value FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name, c.city HAVING SUM(o.total_amount) > 100;'
      },
      {
        type: 'free',
        kind: 'Debug',
        prompt: "You see `Seq Scan on orders (cost=100000)` in EXPLAIN output for a query filtering by `order_date`. The table is 50M rows. What's your move?",
        check: (input) => {
          const t = input.toLowerCase();
          const ok = t.includes('index') && (t.includes('order_date') || t.includes('date'));
          return { correct: ok, feedback: ok
            ? 'Right. `CREATE INDEX idx_orders_date ON orders(order_date);` will make date-range queries fast. Bonus: if you also filter by another column often, a composite index might be even better.'
            : 'Hint: 50M rows + sequential scan = pain. What\'s the standard fix for slow filtered queries?' };
        }
      }
    ]
  }
};
