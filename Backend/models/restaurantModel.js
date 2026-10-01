import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            maxLength: 100,
            minLength: 8,
        },
        address: {
            street: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            area: {
                type: String,
                trim: true,
            },
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,

        },

        image: {
            type: String,
        },

        openingTime: {
            type: String,
            required: true,
        },

        closingTime: {
            type: String,
            required: true,
        },

        isOpen: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;