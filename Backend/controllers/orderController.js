import { Order } from '../models/orderModel.js';
import { Cart } from '../models/cartModel.js';
import crypto from 'node:crypto';

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name phone email address')
            .sort({ createdAt: -1 })
            .lean();

        const ordersWithContact = orders.map((order) => ({
            ...order,
            name: order.name || order.user?.name || 'Customer',
            phone: order.phone || order.user?.phone || '',
            email: order.email || order.user?.email || '',
            address: order.address || order.user?.address || '',
            contactEmail: order.email || order.user?.email || '',
        }));

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders: ordersWithContact
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Unable to fetch orders', error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Unable to fetch your orders', error: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            payment_method = 'cash',
            address,
            phone,
            name,
            items: directItems
        } = req.body;

        let orderItems = [];
        let total = 0;

        // Try getting items from Cart database
        const cart = await Cart.findOne({ userId });

        if (cart && cart.items && cart.items.length > 0) {
            orderItems = cart.items.map(item => ({
                foodId: item.foodId,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity || 1
            }));
            total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } else if (Array.isArray(directItems) && directItems.length > 0) {
            orderItems = directItems.map(item => ({
                foodId: item.foodId || item._id,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity || 1
            }));
            total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } else {
            return res.status(400).json({ success: false, message: 'Your cart is empty. Add food items before ordering.' });
        }

        const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        const newOrder = await Order.create({
            order_id: generatedOrderId,
            user: userId,
            name: name || req.user.name || 'Valued Customer',
            phone: phone || req.user.phone || '',
            email: req.user.email || '',
            address: address || req.user.address || 'Address not provided',
            payment_method: ['cash', 'esewa', 'khalti'].includes(payment_method) ? payment_method : 'cash',
            status: 'Pending',
            items: orderItems,
            total
        });

        // Clear user's cart in the database
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: newOrder,
            cart: { items: [], total: 0 }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ success: false, message: 'Unable to place order', error: error.message });
    }
};

export const acceptOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = 'Accepted';
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order accepted successfully',
            order
        });
    } catch (error) {
        console.error('Error accepting order:', error);
        return res.status(500).json({ success: false, message: 'Unable to accept order', error: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = 'Cancelled';
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ success: false, message: 'Unable to cancel order', error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ['Pending', 'Accepted', 'Preparing', 'Packing', 'On route', 'Delivered', 'Cancelled'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ success: false, message: 'Unable to update status', error: error.message });
    }
};

export const advanceOrderStatus = async (req, res) => {
    const nextStatus = {
        Pending: 'Accepted',
        Accepted: 'Preparing',
        Preparing: 'Packing',
        Packing: 'On route',
        'On route': 'Delivered',
    };

    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const next = nextStatus[order.status];
        if (!next) return res.status(400).json({ success: false, message: 'This order cannot be advanced further' });

        order.status = next;
        await order.save();
        return res.status(200).json({ success: true, message: `Order marked as ${next}`, order });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Unable to update order status', error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to delete order', error: error.message });
    }
};

// User: update item quantities on a Pending order
export const updateOrderItems = async (req, res) => {
    try {
        const { id } = req.params;
        const { items } = req.body;
        const userId = req.user._id;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items array is required' });
        }

        const order = await Order.findOne({ _id: id, user: userId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (order.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'You can only edit items on a Pending order' });
        }

        // Update quantities; filter out items with quantity <= 0
        const updatedItems = items
            .filter(item => Number(item.quantity) > 0)
            .map(item => {
                const existing = order.items.find(i => i._id.toString() === item._id.toString());
                if (!existing) return null;
                existing.quantity = Number(item.quantity);
                return existing;
            })
            .filter(Boolean);

        if (updatedItems.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one item must remain in the order' });
        }

        order.items = updatedItems;
        order.total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await order.save();

        return res.status(200).json({ success: true, message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order items:', error);
        return res.status(500).json({ success: false, message: 'Unable to update order', error: error.message });
    }
};

// User: cancel their own Pending order
export const userCancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: id, user: userId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (order.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'You can only cancel a Pending order' });
        }

        order.status = 'Cancelled';
        await order.save();

        return res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ success: false, message: 'Unable to cancel order', error: error.message });
    }
};
