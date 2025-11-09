import { pool } from '../db';
import { IGroup, CreateGroupRequest } from '../../types';

export const createGroup = async (groupData: CreateGroupRequest): Promise<IGroup> => {
  // Временно используем фиксированный user_id, пока нет авторизации
  const tempUserId = '00000000-0000-0000-0000-000000000000'; // временный UUID
  
  const query = `
    INSERT INTO groups (user_id, title, color)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const values = [tempUserId, groupData.title, groupData.color];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllGroups = async (): Promise<IGroup[]> => {
  const query = `SELECT * FROM groups ORDER BY created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
};

export const getGroupById = async (id: string): Promise<IGroup | null> => {
  const query = `SELECT * FROM groups WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const deleteGroup = async (groupId: string): Promise<{ 
  deletedGroup: IGroup | null;
  deletedTodosCount: number;
}> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Находим группу перед удалением (для ответа)
    const groupResult = await client.query('SELECT * FROM groups WHERE id = $1', [groupId]);
    const group = groupResult.rows[0] || null;

    if (!group) {
      await client.query('ROLLBACK');
      return { deletedGroup: null, deletedTodosCount: 0 };
    }

    // 2. Считаем сколько задач будет удалено (для логов)
    const todosCountResult = await client.query(
      'SELECT COUNT(*) FROM todos WHERE group_id = $1',
      [groupId]
    );
    const deletedTodosCount = parseInt(todosCountResult.rows[0].count);

    // 3. Удаляем группу (каскадно удалятся все задачи благодаря ON DELETE CASCADE)
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