import { Request, Response } from 'express';
import { 
  getTodosByGroup, 
  getTodayTodos, 
  createTodo,
  getTodoById,
  deleteTodo,
  toggleTodo
} from '../database/queries/todos';
import { CreateTodoRequest } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface TodosResponse {
  todos: any[];
}

interface TodoResponse {
  todo: any;
}

// Получение задач по группе
export const getTodosByGroupController = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<TodosResponse>>
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

    // Передаем userId в query для фильтрации
    const todos = await getTodosByGroup(id, userId);

    res.json({
      success: true,
      data: { todos }
    });
  } catch (error) {
    console.error('Error fetching todos by group:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Получение сегодняшних задач
export const getTodayTodosController = async (
  req: Request,
  res: Response<ApiResponse<TodosResponse>>
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const todos = await getTodayTodos(userId); // ← Передаем userId

    res.json({
      success: true,
      data: { todos }
    });
  } catch (error) {
    console.error('Error fetching today todos:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Создание задачи
export const createTodoController = async (
  req: Request<{}, {}, Omit<CreateTodoRequest, 'user_id'>>,
  res: Response<ApiResponse<TodoResponse>>
): Promise<void> => {
  try {
    const {
      group_id,
      title,
      description,
      priority,
      date,
      color
    } = req.body;

    // Валидация
    if (!group_id || !title || !title.trim()) {
      res.status(400).json({
        success: false,
        error: 'Group ID and title are required'
      });
      return;
    }

    // Используем userId из JWT токена!
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    // Создаем задачу с реальным userId
    const newTodo = await createTodo({
      group_id,
      title: title.trim(),
      description: description?.trim(),
      priority: priority || 'mid',
      completed: false,
      date: date || new Date().toISOString(),
      color: color || '#ffffff',
      user_id: userId // ← Используем реальный userId
    });

    const response: ApiResponse<TodoResponse> = {
      success: true,
      data: { todo: newTodo },
      message: 'Todo created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Получение задачи по ID (дополнительно)
export const getTodoController = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<TodoResponse>>
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
    const todo = await getTodoById(id, userId);

    if (!todo) {
      res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { todo }
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteTodoController = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<{ success: boolean }>>
): Promise<void> => {
  try {
    const { id } = req.params;

    const isDeleted = await deleteTodo(id);

    if (!isDeleted) {
      res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { success: true },
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Переключение статуса completed
export const toggleTodoController = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<TodoResponse>>
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedTodo = await toggleTodo(id);

    if (!updatedTodo) {
      res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { todo: updatedTodo },
      message: 'Todo toggled successfully'
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};