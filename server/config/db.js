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

// Check if running on Render (production) or local
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for Render's SSL connection
      }
    : {
        user: "postgres",            // your local username
        host: "localhost",           // local host
        database: "postgres",        // local database name
        password: "pgadmin",         // your local PostgreSQL password
        port: 5432,                  // default port
      }
);

// ✅ Test connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("❌ Database connection error:", err.stack));

module.exports = pool;
