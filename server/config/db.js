// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",      // your postgres username
//   host: "localhost",     // or cloud db host
//   database: "postgres", // your db name
//   password: "pgadmin",
//   port: 5432,            // default postgres port
// });

// // pool.connect()
// //   .then(() => console.log("✅ Connected to PostgreSQL"))
// //   .catch((err) => console.error("❌ Database connection error:", err));


// // 🔹 Test connection immediately
// pool.connect()
//   .then(client => {
//     console.log("✅ Connected to PostgreSQL");
//     client.release(); // release connection back to pool
//   })
//   .catch(err => console.error("❌ Database connection error", err.stack));

// module.exports = pool;
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});


// ✅ Test connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to Render PostgreSQL");
    client.release();
  })
  .catch(err => console.error("❌ Database connection error:", err.stack));

module.exports = pool;
