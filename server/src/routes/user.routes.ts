import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorization.middleware';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize(['admin']), userController.listUsers);
router.patch('/:id/deactivate', authorize(['admin']), userController.deactivateUser);
router.patch('/:id/activate', authorize(['admin']), userController.activateUser);

export default router; 