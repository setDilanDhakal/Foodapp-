import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    payment_method: {
        type: String,
        required: true
    },
    pidx: {
        type: String,
        unique: true,
    },
    total_amount: {
        type: Number,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Payment = mongoose.model("Payment", paymentSchema);
