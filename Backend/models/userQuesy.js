import mongoose from "mongoose";

const userQuerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    supportType: {
        type: String,
        required: true,
    }
})

export const UserQuery = mongoose.model("UserQuery", userQuerySchema);