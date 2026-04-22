const express = require('express');
const cors = require('cors');

const app = express();

// Middleware (Frontend se connection allow karne ke liye)
app.use(cors());
app.use(express.json());

// Fake Database (Real life me hum MongoDB ya MySQL use karte hain)
const usersDB = [
    {
        id: 1,
        email: "test@company.com",
        password: "123456", // Real life me ise encrypt (hash) karte hain
        name: "Aarav Sharma",
        location: "Bengaluru, India",
        role: "Senior Frontend Developer",
        stats: { applied: 24, views: 156, saved: 8 }
    }
];

// --- 1. LOGIN API ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = usersDB.find(u => u.email === email && u.password === password);

    if (user) {
        // Successful Login (Real life me JWT token use hota hai)
        res.json({ 
            success: true, 
            message: "Login successful", 
            token: `fake-token-${user.id}` // Temporary token
        });
    } else {
        // Failed Login
        res.status(401).json({ success: false, message: "Invalid email or password" });
    }
});

// --- 2. GET PROFILE API ---
app.get('/api/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    
    // Token extract karo (Format: "Bearer fake-token-1")
    if (authHeader && authHeader.startsWith("Bearer fake-token-")) {
        const userId = parseInt(authHeader.split('-')[2]);
        const user = usersDB.find(u => u.id === userId);

        if (user) {
            // Password hide karke baaki details bhej do
            const { password, ...safeUserData } = user;
            res.json({ success: true, user: safeUserData });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } else {
        res.status(403).json({ success: false, message: "Unauthorized access" });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});
