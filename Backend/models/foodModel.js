import mongoose from "mongoose";

const foods = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    stock: {
        type: Number,
        required: true,
        min: 0,
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },

    preparationTime: {
        type: String,
        required: true,
        min: 1,
    },
    image: {
        type: String,
        trim: true,
    }

});

export const foodItems = mongoose.model("Food", foods);
