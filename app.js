import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
// import cors from "cors";
import productRouter from "./routes/product.route.js";

dotenv.config();
const app = express();

(async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection established!!: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Connection Failed", error);
        throw error;
    }
})().then(()=> console.log("Connection successful"))
.catch((err) => console.log("Error while connecting: ", err));

// app.use(cors());

app.use("/api/v2/user", userRouter);
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/products", productRouter);
app.use("/api/v2/orders", orderRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend is running");
})