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

    const todos = await getTodosByGroup(id);

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
    const todos = await getTodayTodos();

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

    // Создаем задачу в БД
    const newTodo = await createTodo({
      group_id,
      title: title.trim(),
      description: description?.trim(),
      priority: priority || 'mid',
      date: date || new Date().toISOString(),
      color: color || '#ffffff',
      completed: false,
      user_id: '00000000-0000-0000-0000-000000000000' // временно
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

    const todo = await getTodoById(id);

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