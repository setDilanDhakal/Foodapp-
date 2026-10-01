import Restaurant from "../models/restaurantModel.js";
import bcrypt from "bcrypt";

const registerRestaurant = async (req, res) => {
    const { name, description, phone, email, address, openingTime, closingTime } = req.body;
    const { password } = req.body;
    const { street, city, area } = address || {};
    if (!name || !phone || !email || !address || !password) {
        return res.status(400).json({
            message: "Name, phone, email, address, and password are required"
        })
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        })
    }

    const restaurantName = await Restaurant.findOne({ name });
    if (restaurantName) {
        return res.status(404).json({
            message: "Restaurant already registered"
        })
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await Restaurant.create({
        name,
        description,
        phone,
        email,
        password: hashPassword,
        openingTime,
        closingTime,
        address: {
            street,
            city,
            area
        }
    })
};

export {
    registerRestaurant
}
