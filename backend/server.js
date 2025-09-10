import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

import authRoutes from "./routes/authRoutes.js";
import travelLogRoutes from './routes/travelLogRoutes.js';
import journeyPlanRoutes from "./routes/journeyPlanRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register Routes
app.use("/auth", authRoutes);
app.use("/travel-logs", travelLogRoutes);
app.use("/journey-plans", journeyPlanRoutes);

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("✅ Connected to MySQL database");
        conn.release();
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
})();

app.get("/", (req, res) => {
    res.send("Travel Blog API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default pool;
