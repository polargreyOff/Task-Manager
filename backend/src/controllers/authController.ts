import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, updateUserRefreshToken, updateUserLastLogin } from '../database/queries/users';

// Генерация токенов
const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' } // 15 минут
  );
  
  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' } // 7 дней
  );
  
  return { accessToken, refreshToken };
};

// Регистрация
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    // Валидация
    if (!email || !password || !username) {
      res.status(400).json({ 
        success: false, 
        error: 'Email, password and username are required' 
      });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 4 characters long' 
      });
      return;
    }

    // Проверка существующего пользователя
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
      return;
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Создание пользователя
    const user = await createUser({ 
      email, 
      username, 
      password_hash: hashedPassword 
    });
    
    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    
    // Сохраняем refresh token в БД
    await updateUserRefreshToken(user.id, refreshToken);

    res.status(201).json({
      success: true,
      data: {
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        },
        accessToken,    
        refreshToken
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
    });
  }
};

// Логин пользователя
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
      return;
    }

    // Поиск пользователя
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
      return;
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
      return;
    }

    // Обновляем время последнего логина
    await updateUserLastLogin(user.id);

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    
    // Сохраняем refresh token в БД
    await updateUserRefreshToken(user.id, refreshToken);

    res.json({
      success: true,
      data: {
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        },
        accessToken,
        refreshToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token required'
      });
      return;
    }

    // Проверяем refresh token с правильной типизацией
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      // Типизируем decoded
      const user = decoded as { userId: string; email: string };
      
      // Проверяем что refresh token есть в БД
      const dbUser = await findUserById(user.userId);
      if (!dbUser || dbUser.refresh_token !== refreshToken) {
        return res.status(403).json({
          success: false,
          error: 'Refresh token not found'
        });
      }

      // Генерируем новые токены
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.userId, user.email);
      
      // Обновляем refresh token в БД
      await updateUserRefreshToken(user.userId, newRefreshToken);

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed'
    });
  }
};

// Получение профиля пользователя
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    // Получаем полную информацию о пользователе
    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Возвращаем профиль без sensitive данных
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          created_at: user.created_at,
          last_login: user.last_login
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};