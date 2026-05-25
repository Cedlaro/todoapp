import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.middleware';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

router.use(requireAuth);

const createRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional({ nullable: true }).isISO8601().toDate(),
];

const updateRules = [
  body('title').optional().trim().notEmpty(),
  body('status').optional().isIn(['pending', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional({ nullable: true }).isISO8601().toDate(),
];

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createRules, createTask);
router.patch('/:id', updateRules, updateTask);
router.delete('/:id', deleteTask);

export default router;
