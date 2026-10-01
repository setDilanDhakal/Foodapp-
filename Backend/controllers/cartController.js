import { Cart } from "../models/cartModel.js";
import { foodItems } from "../models/foodModel.js";

const serializeCart = (cart) => {
    if (!cart || !cart.items) {
        return { items: [], total: 0 };
    }
    const total = cart.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
    return {
        items: cart.items,
        total,
    };
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        return res.status(200).json({
            success: true,
            cart: serializeCart(cart),
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch cart",
            error: error.message,
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const foodId = req.body.foodId || req.body.productId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please log in to add items to cart",
            });
        }

        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "Food item ID is required",
            });
        }

        const food = await foodItems.findById(foodId);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [
                    {
                        foodId: food._id,
                        name: food.name,
                        price: food.price,
                        image: food.image || "",
                        quantity: 1,
                    },
                ],
            });

            return res.status(201).json({
                success: true,
                message: `${food.name} added to cart`,
                alreadyInCart: false,
                cart: serializeCart(cart),
            });
        }

        // Check if the product already exists in the cart
        const existingItem = cart.items.find(
            (item) => item.foodId.toString() === food._id.toString()
        );

        if (existingItem) {
            // Increase quantity by 1 when user adds the same item again
            existingItem.quantity += 1;
            await cart.save();

            return res.status(200).json({
                success: true,
                message: `${food.name} quantity updated`,
                alreadyInCart: false,
                cart: serializeCart(cart),
            });
        }

        // Otherwise add new food item with quantity 1
        cart.items.push({
            foodId: food._id,
            name: food.name,
            price: food.price,
            image: food.image || "",
            quantity: 1,
        });

        await cart.save();

        return res.status(200).json({
            success: true,
            message: `${food.name} added to cart`,
            alreadyInCart: false,
            cart: serializeCart(cart),
        });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const foodId = req.body.foodId || req.body.productId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!foodId) {
            return res.status(400).json({ success: false, message: "Food item ID is required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.foodId.toString() === foodId.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not in cart" });
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: serializeCart(cart),
        });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const foodId = req.body.foodId || req.body.productId;
        const delta = Number(req.body.delta) || 0;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!foodId) {
            return res.status(400).json({ success: false, message: "Food item ID is required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.foodId.toString() === foodId.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not in cart" });
        }

        if (delta < 0) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }
        } else if (delta > 0) {
            cart.items[itemIndex].quantity += 1;
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: serializeCart(cart),
        });
    } catch (error) {
        console.error("Error updating quantity:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart: { items: [], total: 0 },
        });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};