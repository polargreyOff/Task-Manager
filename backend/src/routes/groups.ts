import { Router } from 'express';
import { createGroupController, getGroupsController, getGroupController, deleteGroupController} from '../controllers/groupsController';

const router = Router();

// POST /api/groups - создание группы
router.post('/', createGroupController);

// GET /api/groups - получение всех групп
router.get('/', getGroupsController);

// GET /api/groups/:id - получение группы по ID
router.get('/:id', getGroupController);

// DELETE /api/groups/:id - удаление группы
router.delete('/:id', deleteGroupController);

export default router;