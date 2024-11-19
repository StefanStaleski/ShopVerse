import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorization.middleware';
import { validateCreateProduct, validateUpdateProduct } from '../middleware/validation/product.validation'

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/',
    authenticate,
    authorize(['admin']),
    validateCreateProduct,
    productController.createProduct
);

router.put('/:id',
    authenticate,
    authorize(['admin']),
    validateUpdateProduct,
    productController.updateProduct
);

router.delete('/:id',
    authenticate,
    authorize(['admin']),
    productController.deleteProduct
);

export default router; 