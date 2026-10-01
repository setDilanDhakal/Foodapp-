import { userOrderModel } from "../models/UserOrderModel.js";

const UserOrder = async (req, res) => {
    try {
        const { name, price, quantity, foodId, userId } = req.body;
        if (!name || !price || !quantity || !foodId ||!userId) {
            return res.status(404).json({
                message: "Please order valid product"
            })
        }

        const orderPlaced = await userOrderModel.create({
            name,
            price,
            quantity,
            foodId,
            userId
        });

        return res.status(201).json({
            message: "Order placed successfully",
            data: name
        })
    } catch (error) {
        return res.status(404).json({
            message: "Error occured during food order", error
        })
    }
}

export {
    UserOrder
}