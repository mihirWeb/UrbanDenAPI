import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        img: {
            type: String
        },
        fullName: {
            type: String
        },
        address: {
            type: String
        },
        phone: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema);