import { pool } from '../db';
import { ITodo, CreateTodoRequest } from '../../types';
import { formatDateForDB, getTodayDate } from '../../utils/index';

export const getTodosByGroup = async (groupId: string): Promise<ITodo[]> => {
  const query = `
    SELECT * FROM todos 
    WHERE group_id = $1 
    ORDER BY 
      CASE priority 
        WHEN 'high' THEN 1 
        WHEN 'mid' THEN 2 
        WHEN 'low' THEN 3 
      END,
      created_at DESC
  `;
  
  const result = await pool.query(query, [groupId]);
  return result.rows;
};

export const getTodayTodos = async (): Promise<ITodo[]> => {
  const today = getTodayDate();
  
  const query = `
    SELECT 
      t.*,
      g.color as group_color
    FROM todos t
    LEFT JOIN groups g ON t.group_id = g.id
    WHERE t.date = $1
    ORDER BY 
      CASE t.priority 
        WHEN 'high' THEN 1 
        WHEN 'mid' THEN 2 
        WHEN 'low' THEN 3 
      END,
      t.created_at DESC
  `;
  
  const result = await pool.query(query, [today]);
  return result.rows;
};

export const createTodo = async (todoData: CreateTodoRequest): Promise<ITodo> => {
  const {
    group_id,
    title,
    description,
    priority,
    date,
    color
  } = todoData;

  // Используем временного пользователя (как в группах)
  const tempUserId = '00000000-0000-0000-0000-000000000000';

  const query = `
    INSERT INTO todos (user_id, group_id, title, description, priority, date, color, completed)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const values = [
    tempUserId,
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

export const getTodoById = async (id: string): Promise<ITodo | null> => {
  const query = `
    SELECT 
      t.*,
      g.color as group_color
    FROM todos t
    LEFT JOIN groups g ON t.group_id = g.id
    WHERE t.id = $1
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const deleteTodo = async (todoId: string): Promise<boolean> => {
  const query = 'DELETE FROM todos WHERE id = $1';
  const result = await pool.query(query, [todoId]);
  
  // Если affected rows > 0, значит задача была удалена
  return result.rowCount! > 0;
};

export const toggleTodo = async (todoId: string): Promise<ITodo | null> => {
  const query = `
    UPDATE todos 
    SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1 
    RETURNING *
  `;
  
  const result = await pool.query(query, [todoId]);
  return result.rows[0] || null;
};