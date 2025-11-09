import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database/db";

import groupsRouter from './routes/groups';
import todosRouter from "./routes/todos";
import cors from "cors";    

dotenv.config();


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3001',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

console.log('🔧 Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);

app.use(express.json());

app.use("/api/groups", groupsRouter);
app.use("/api/todos", todosRouter);

const startServer = async () => {
  try {
    // Тестируем подключение к БД
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`🗄️  Connected to PostgreSQL database`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();