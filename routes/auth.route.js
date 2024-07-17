import { Router } from "express";
import { ApiError } from "../utils/ApiError.util.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import express from "express"
import jwt from "jsonwebtoken";

const authRouter  = Router();
authRouter.use(express.json());


// REGISTER
authRouter.post("/register", async (req, res) => {
    const { username, email, password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if([username, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    console.log("password", password)

    const user = new User({
        username: username,
        email: email,
        password: password,
        ...rest
    });

    try {
        await user.save();
        res.status(200).json(new ApiResponse(200, user, "User Registered Successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while registering the user", error);
    }
})


// LOGIN

authRouter.post("/login", async (req, res) => {
    try {
        const {username , password} = req.body;
    
        const user = await User.findOne({username: username});
        if(!user){
            throw new ApiError(400, "user doesn't exist");
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            throw new ApiError(400, "Incorrect password");
        }

        // creating access token

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, 
            process.env.JWT_SEC_KEY,
        {
            expiresIn: "3d"
        })
    
        return res.status(200).json(new ApiResponse(201, {user, accessToken}, "user logged in successfully"));
    } catch (error) {
        throw new ApiError(400, "something went wrong while login user", error)
    }
})

export default authRouter;