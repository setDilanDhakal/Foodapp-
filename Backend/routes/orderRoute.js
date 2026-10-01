import { Router } from 'express';
import {
    getOrders,
    getUserOrders,
    createOrder,
    acceptOrder,
    cancelOrder,
    advanceOrderStatus,
    updateOrderStatus,
    deleteOrder,
    updateOrderItems,
    userCancelOrder
} from '../controllers/orderController.js';
import {
    getCart,
    addToCart,
    removeFromCart
} from '../controllers/cartController.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyAdmin from '../middlewares/adminVerifyJWT.js';

const orderRouter = Router();

// Admin routes
orderRouter.get('/', verifyAdmin, getOrders);
orderRouter.patch('/:id/accept', verifyAdmin, acceptOrder);
orderRouter.patch('/:id/cancel', verifyAdmin, cancelOrder);
orderRouter.patch('/:id/advance-status', verifyAdmin, advanceOrderStatus);
orderRouter.patch('/:id/status', verifyAdmin, updateOrderStatus);
orderRouter.delete('/:id', verifyAdmin, deleteOrder);

// User order routes
orderRouter.get('/my-orders', verifyJWT, getUserOrders);
orderRouter.post('/create', verifyJWT, createOrder);
orderRouter.post('/checkout', verifyJWT, createOrder);
orderRouter.patch('/:id/update-items', verifyJWT, updateOrderItems);
orderRouter.patch('/:id/user-cancel', verifyJWT, userCancelOrder);

// Backward-compatible cart routes under /api/orders/cart
orderRouter.get('/cart', verifyJWT, getCart);
orderRouter.post('/cart/add', verifyJWT, addToCart);
orderRouter.post('/cart/remove', verifyJWT, removeFromCart);

export default orderRouter;
