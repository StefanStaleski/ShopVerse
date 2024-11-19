import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validatePasswordUpdate, validateProfileUpdate } from '../middleware/validation/profile.validation';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

router.get('/', profileController.getProfile);
router.patch('/', validateProfileUpdate, profileController.updateProfile);
router.patch('/password', validatePasswordUpdate, profileController.updatePassword);

export default router; 