import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {app,server} from './lib/socket.js';



// Port from environment variables or default to 3000
dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(cookieParser()); // Para poder usar las cookies en las peticiones de tipo post y get y put y delete y asi poder usar el middleware protectRoute 
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://tu-dominio.com' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});






