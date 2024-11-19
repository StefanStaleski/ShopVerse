import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateCreateOrder, validateUpdateOrderStatus, validateUpdatePaymentStatus } from '../middleware/validation/order.validation';

const router = Router();

// Protected routes (require authentication)
router.use(authenticate);

// Customer routes
router.post('/', validateCreateOrder, orderController.createOrder);
router.get('/my-orders', orderController.getOrders); // For customers to view their own orders
router.get('/:id', orderController.getOrder);

// Admin/Staff routes
router.get('/', authorize('admin', 'staff'), orderController.getOrders);
router.patch('/:id/status', authorize('admin', 'staff'), validateUpdateOrderStatus, orderController.updateOrderStatus);
router.patch('/:id/payment', authorize('admin', 'staff'), validateUpdatePaymentStatus, orderController.updatePaymentStatus);
router.delete('/:id', authorize('admin'), orderController.deleteOrder);

export default router; 