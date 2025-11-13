import { pool } from '../db';
import { ITodo, CreateTodoRequest } from '../../types';
import { formatDateForDB, getTodayDate } from '../../utils/index';

export const getTodosByGroup = async (groupId: string, userId?: string): Promise<ITodo[]> => {
  let query = `
    SELECT * FROM todos 
    WHERE group_id = $1 
  `;
  let values: any[] = [groupId];
  
  // Если передан userId, проверяем что задачи принадлежат пользователю
  if (userId) {
    query += ` AND user_id = $2`;
    values.push(userId);
  }
  
  query += `
    ORDER BY 
      CASE priority 
        WHEN 'high' THEN 1 
        WHEN 'mid' THEN 2 
        WHEN 'low' THEN 3 
      END,
      created_at DESC
  `;
  
  const result = await pool.query(query, values);
  return result.rows;
};


export const getTodayTodos = async (userId: string): Promise<ITodo[]> => {
  const today = getTodayDate();
  
  const query = `
    SELECT 
      t.*,
      g.color as group_color
    FROM todos t
    LEFT JOIN groups g ON t.group_id = g.id
    WHERE t.user_id = $1 AND t.date = $2
    ORDER BY 
      CASE t.priority 
        WHEN 'high' THEN 1 
        WHEN 'mid' THEN 2 
        WHEN 'low' THEN 3 
      END,
      t.created_at DESC
  `;
  
  const result = await pool.query(query, [userId, today]);
  return result.rows;
};

export const createTodo = async (todoData: CreateTodoRequest): Promise<ITodo> => {
  const {
    user_id,
    group_id,
    title,
    description,
    priority,
    date,
    color
  } = todoData;

  const query = `
    INSERT INTO todos (user_id, group_id, title, description, priority, date, color, completed)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const values = [
    user_id,
    group_id,
    title,
    description || null,
    priority,
    formatDateForDB(date),
    color,
    false // completed по умолчанию false
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getTodoById = async (id: string, userId?: string): Promise<ITodo | null> => {
  let query = `
    SELECT 
      t.*,
      g.color as group_color
    FROM todos t
    LEFT JOIN groups g ON t.group_id = g.id
    WHERE t.id = $1
  `;
  let values: any[] = [id];
  
  if (userId) {
    query += ` AND t.user_id = $2`;
    values.push(userId);
  }
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteTodo = async (todoId: string, userId?: string): Promise<boolean> => {
  let query = 'DELETE FROM todos WHERE id = $1';
  let values: any[] = [todoId];
  
  if (userId) {
    query += ' AND user_id = $2';
    values.push(userId);
  }
  
  const result = await pool.query(query, values);
  return result.rowCount! > 0;
};

export const toggleTodo = async (todoId: string, userId?: string): Promise<ITodo | null> => {
  let query = `
    UPDATE todos 
    SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1
  `;
  let values: any[] = [todoId];
  
  if (userId) {
    query += ' AND user_id = $2';
    values.push(userId);
  }
  
  query += ' RETURNING *';
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};