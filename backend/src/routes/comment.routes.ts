import { Router } from 'express';
import { addComment, deleteComment } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/tasks/:taskId/comments', addComment);
router.delete('/comments/:id', deleteComment);

export default router;