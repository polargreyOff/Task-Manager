import { pool } from '../db';
import { IUser, CreateUserRequest } from '../../types';

export const createUser = async (userData: CreateUserRequest): Promise<IUser> => {
  const { email, username, password_hash } = userData;
  
  const query = `
    INSERT INTO users (email, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, username, created_at, updated_at
  `;
  
  const values = [email, username, password_hash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  const query = 'SELECT * FROM users WHERE id = $1'; // ← Теперь SELECT * чтобы получить refresh_token
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updateUserRefreshToken = async (userId: string, refreshToken: string | null): Promise<void> => {
  const query = 'UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
  await pool.query(query, [refreshToken, userId]);
};

export const updateUserLastLogin = async (userId: string): Promise<void> => {
  const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
  await pool.query(query, [userId]);
};