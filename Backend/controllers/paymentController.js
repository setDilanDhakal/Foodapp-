import axios from "axios";
import { Payment } from "../models/PaymentModel.js";

export const initiateKhaltiPayment = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { amount, items } = req.body;

        if (!amount || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Amount and items are required"
            });
        }
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const payload = {
            return_url: "http://localhost:5173/my-orders",
            website_url: "http://localhost:5173",
            purchase_order_id: `BHOJ-${Date.now()}`,
            purchase_order_name: "Bhoj Express Order",
            amount: Math.round(Number(amount) * 100),
            customer_info: {
                name: req.user?.name || "Test User",
                email: req.user?.email || "test@gmail.com",
                phone: req.user?.phone || "9800000000"
            }
        };

        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", payload, {
            headers: {
                "Authorization": "Key live_secret_key_68791341fdd94846a146f0457ff7b455",
                "Content-Type": "application/json"
            }
        });
        
        return res.json(response.data);

    } catch (error) {
        console.error("Khalti initiate error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.detail || error.message || "Failed to initiate Khalti payment"
        });
    }
};

export const verifyKhaltiPayment = async (req, res) => {
    try {
        const { pidx } = req.body;

        if (!pidx) {
            return res.status(400).json({ status: false, message: "Invalid input" });
        }

        const response = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    Authorization: "Key live_secret_key_68791341fdd94846a146f0457ff7b455",
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data;

        if (result.status === "Completed") {
            return res.json({
                success: true,
                message: "Payment verified",
                data: result
            });
        } else {
            return res.json({
                success: false,
                message: "Payment not completed",
                data: result
            });
        }

    } catch (error) {
        console.error("Khalti verify error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.detail || error.message
        });
    }
};

export const savePayment = async (req, res) => {
    try {
        const { payment_method, pidx, total_amount, user_id } = req.body;

        if (!payment_method || !pidx || !total_amount || !user_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const payment = new Payment({
            payment_method,
            pidx,
            total_amount,
            user_id
        });

        await payment.save();
        return res.status(201).json({
            success: true,
            message: "Payment saved successfully",
            payment
        });

    } catch (error) {
        console.error("Payment save error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.detail || error.message
        });
    }
}