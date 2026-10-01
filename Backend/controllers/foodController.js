import { foodItems } from "../models/foodModel.js";
import { Category } from '../models/categoryModel.js';
import { uploadOnCloudinary } from "../middlewares/cloudinary.js"

const foodItem = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category,
            preparationTime
        } = req.body;

        // Get restaurant ID from logged-in user
        const restaurantId = req.user.restaurantId;

        // Check required fields
        if (
            !name ||
            !price ||
            stock === undefined ||
            !category ||
            !preparationTime
        ) {
            return res.status(400).json({
                message: "Name, price, stock, category, and preparationTime are required"
            });
        }

        const selectedCategory = await Category.findOne({ name: category.trim() });
        if (!selectedCategory) {
            return res.status(400).json({ message: 'Please select a valid category' });
        }

        const localFilePath = req.file?.path;
        if (!localFilePath) {
            return res.status(404).json({
                message: "Unable to upload file in cloudinary"
            })
        }

        const imageURL = await uploadOnCloudinary(localFilePath);
        // Check if food already exists in this restaurant
        //const dish = await foodItems.findOne({name});

        // if (dish) {
        //     return res.status(400).json({
        //         message: "Food item already exists in this restaurant"
        //     });
        // }

        // Create food item
        const food = await foodItems.create({
            name,
            description,
            price,
            stock,
            category,
            preparationTime,
            image: imageURL
        });

        return res.status(201).json({
            message: "Food item created successfully",
            food
        });

    } catch (error) {
        console.error("Error creating food item:", error);

        return res.status(500).json({
            message: "Internal server error", error
        });
    }
};

const getFoods = async (req, res) => {
    const foods = await foodItems.find();
    if (!foods) {
        return res.status(404).json({
            message: "Unable to get food items"
        });
    }

    return res.status(201).json({
        message: "All food items",
        foods
    });
};

const updateFood = async (req, res) => {
    try {
        const { name, description, price, stock, category, preparationTime } = req.body;
        const updates = { name, description, price, stock, category, preparationTime };

        if (category) {
            const selectedCategory = await Category.findOne({ name: category.trim() });
            if (!selectedCategory) return res.status(400).json({ message: 'Please select a valid category' });
        }

        if (req.file) {
            updates.image = await uploadOnCloudinary(req.file.path);
        }

        const food = await foodItems.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        return res.status(200).json({ message: "Food item updated successfully", food });
    } catch (error) {
        console.error("Error updating food item:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const deleteFood = async (req, res) => {
    try {
        const food = await foodItems.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        return res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error("Error deleting food item:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const getbycategory = async (req, res) => {
    try {
        const category = await foodItems.find({category: req.params.category}).limit(5);
        if (!category) {
            return res.status(404).json({
                message: "No such category exist"
            })
        }
        return res.status(201).json({
            message: "Food items found",
            data: category
        })
    } catch (error) {
        console.error("Error finding category", error);
        return res.status(404).json({
            message: "Couldnot get food item", error
        })
    }
}

export {
    foodItem,
    getFoods,
    updateFood,
    deleteFood,
    getbycategory
};
