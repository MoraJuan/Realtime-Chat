import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';

const app = express();

// Port from environment variables or default to 3000
dotenv.config();
const PORT = process.env.PORT || 3000;


app.use(cookieParser()); // Para poder usar las cookies en las peticiones de tipo post y get y put y delete y asi poder usar el middleware protectRoute 
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

