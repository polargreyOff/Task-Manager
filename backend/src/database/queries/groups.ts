import { pool } from '../db';
import { IGroup, CreateGroupRequest } from '../../types';

export const createGroup = async (groupData: CreateGroupRequest): Promise<IGroup> => {
  // Временно используем фиксированный user_id, пока нет авторизации
  
  const query = `
    INSERT INTO groups (user_id, title, color)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const values = [groupData.user_id, groupData.title, groupData.color];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllGroups = async (userId: string): Promise<IGroup[]> => {
  const query = `SELECT * FROM groups WHERE user_id = $1 ORDER BY created_at DESC`;
  const result = await pool.query(query, [userId]); // ← Фильтруем по пользователю
  return result.rows;
};

export const getGroupById = async (id: string, userId?: string): Promise<IGroup | null> => {
  let query = `SELECT * FROM groups WHERE id = $1`;
  let values: any[] = [id];
  
  // Если передан userId, проверяем что группа принадлежит пользователю
  if (userId) {
    query += ` AND user_id = $2`;
    values.push(userId);
  }
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteGroup = async (groupId: string, userId?: string): Promise<{ 
  deletedGroup: IGroup | null;
  deletedTodosCount: number;
}> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Находим группу (с проверкой пользователя если нужно)
    let groupQuery = 'SELECT * FROM groups WHERE id = $1';
    let groupValues: any[] = [groupId];
    
    if (userId) {
      groupQuery += ' AND user_id = $2';
      groupValues.push(userId);
    }
    
    const groupResult = await client.query(groupQuery, groupValues);
    const group = groupResult.rows[0] || null;

    if (!group) {
      await client.query('ROLLBACK');
      return { deletedGroup: null, deletedTodosCount: 0 };
    }

    // Считаем задачи (они удалятся каскадно)
    const todosCountResult = await client.query(
      'SELECT COUNT(*) FROM todos WHERE group_id = $1',
      [groupId]
    );
    const deletedTodosCount = parseInt(todosCountResult.rows[0].count);

    // Удаляем группу
    await client.query('DELETE FROM groups WHERE id = $1', [groupId]);

    await client.query('COMMIT');

    return {
      deletedGroup: group,
      deletedTodosCount
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};