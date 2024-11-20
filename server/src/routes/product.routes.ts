import { Router } from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorization.middleware';
import { validateCreateProduct, validateUpdateProduct } from '../middleware/validation/product.validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', authorize(['admin']), validateCreateProduct, createProduct);
router.put('/:id', authorize(['admin']), validateUpdateProduct, updateProduct);
router.delete('/:id', authorize(['admin']), deleteProduct);

export default router; 