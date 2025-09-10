import bcrypt from "bcryptjs";
import mysql from "../server.js";  // Reusing the pool from server.js
import jwt from "jsonwebtoken";

// Register User
export const register = async (req, res) => {
    const { username, password, email, address } = req.body;

    // Basic validation
    if (!username || !password || !email || !address) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    try {
        // Check if user already exists
        const [existingUser] = await mysql.query("SELECT * FROM travel_users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const result = await mysql.query("INSERT INTO travel_users (username, password, email, address, travel_logs, journey_plans) VALUES (?, ?, ?, ?, '[]', '[]')", [
            username, hashedPassword, email, address
        ]);

        res.status(201).json({ message: "User registered successfully", user: { username, email, address } });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Server error" });
    }
};

//Login
export const login = async (req, res) => {
    const { username, password } = req.body; // Ensure 'username' is being used

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Query by username instead of email
        const [user] = await mysql.query("SELECT * FROM travel_users WHERE username = ?", [username]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const match = await bcrypt.compare(password, user[0].password);

        if (!match) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// Fetch user profile data
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // set from authenticateToken

        const query = 'SELECT username, email, address, created_at FROM travel_users WHERE id = ?';
        const values = [userId];
        const [rows] = await mysql.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        res.json({
            username: user.username,
            email: user.email,
            address: user.address || 'Not provided', // Ensure 'address' is sent to frontend
            createdAt: user.created_at,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
