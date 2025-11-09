import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'task_manager',
  password: process.env.DB_PASSWORD || 'karsevs2017',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Тестовое подключение
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};