import { Router } from 'express';
import { 
  getTodosByGroupController,
  getTodayTodosController,
  createTodoController,
  getTodoController,
  deleteTodoController,
  toggleTodoController
} from '../controllers/todosController';

const router = Router();

// GET /api/todos/today - получение сегодняшних задач
router.get('/today', getTodayTodosController);

// GET /api/todos/:id - получение задач по группе
router.get('/:id', getTodosByGroupController);

// POST /api/todos - создание задачи
router.post('/', createTodoController);

// GET /api/todos/:id - получение задачи по ID
router.get('/:id', getTodoController);

// DELETE /api/todos/:id - удаление задачи
router.delete('/:id', deleteTodoController);

// PATCH /api/todos/:id/toggle - переключение статуса задачи
router.patch('/:id/toggle', toggleTodoController);

export default router;