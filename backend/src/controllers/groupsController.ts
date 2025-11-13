import { Request, Response } from 'express';
import { createGroup, getAllGroups, getGroupById, deleteGroup } from '../database/queries/groups';
import { CreateGroupRequest } from '../types';

// Типизированный ответ как на фронте
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

interface GroupResponse {
  group: any; // Можно уточнить тип позже
}

export const createGroupController = async (
  req: Request<{}, {}, CreateGroupRequest>,
  res: Response<ApiResponse<GroupResponse>>
): Promise<void> => {
  try {
    const { title, color } = req.body;

    // Валидация
    if (!title || !color) {
      res.status(400).json({
        success: false,
        message: 'Title and color are required'
      });
      return;
    }

    // Используем userId из JWT токена!
    const userId = req.user?.userId; // ← Теперь берем из аутентифицированного пользователя

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Создаем группу с реальным userId
    const newGroup = await createGroup({
      title,
      color,
      user_id: userId // ← Используем реальный userId
    });

    const response: ApiResponse<GroupResponse> = {
      success: true,
      data: { group: newGroup },
      message: 'Group created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getGroupsController = async (
  req: Request,
  res: Response<ApiResponse<{ groups: any[] }>>
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const groups = await getAllGroups(userId);
    
    res.json({
      success: true,
      data: { groups },
      message: 'Groups retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getGroupController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    // Передаем userId в query для проверки принадлежности
    const group = await getGroupById(id, userId);

    if (!group) {
      res.status(404).json({
        success: false,
        error: 'Group not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { group }
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteGroupController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await deleteGroup(id);

    if (!result.deletedGroup) {
      res.status(404).json({
        success: false,
        error: `Group with id ${id} not found`,
        code: 404
      });
      return;
    }

    // Форматируем ответ как на фронте
    const response = {
      success: true,
      data: { success: true },
      message: `Group "${result.deletedGroup.title}" and ${result.deletedTodosCount} related todos deleted successfully`
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 500
    });
  }
};