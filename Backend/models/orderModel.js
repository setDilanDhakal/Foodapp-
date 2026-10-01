import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
    },
    payment_method: {
        type: String,
        enum: ['esewa', 'khalti', 'cash'],
        default: 'cash'
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'Packing', 'On route', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
