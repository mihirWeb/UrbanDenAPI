import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import cors from "cors";
import productRouter from "./routes/product.route.js";
import path from "path";

dotenv.config();
const app = express();

// const allowedOrigins = [
//     "https://urbanden.onrender.com",
//     "https://urbanden.onrender.com/",
//     "http://localhost:5173/",
//     "http://localhost:5173",
//     "https://admindashboard-j6if.onrender.com/",
//     "https://admindashboard-j6if.onrender.com", // Add this
//     "*"
//   ];
  
app.use(cors());

app.use(express.static('./build')); // Serve static files

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

// Catch-all route handler for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend is running");
})