import { Router } from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorize } from "../middlewares/verifyToken.middleware.js";
import bcrypt from "bcrypt"
import express from "express";
import { User } from "../models/User.model.js";

const userRouter = Router();
userRouter.use(express.json())

// to update the user detials -

userRouter.put("/:id", verifyTokenAndAuthorize, async (req, res) => {
    if (req.body.password) {
      req.body.password = bcrypt.hash(req.body.password, 10);
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// delete the user: 

//DELETE
userRouter.delete("/:id", verifyTokenAndAuthorize, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
});


//   to get the user

userRouter.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get all the users 

userRouter.get("/all-user", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5) // if we dont sort with id -1 then it will return first  5 user rather than recent 5 users 
        : await User.find(); // returns all users
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // GET USER STATS

  userRouter.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1)); // current date but last year

    try {
        const data = await User.aggregate(
            [
                {
                    $match: {createdAt: {$gte: lastYear}} // date should be greater than last year
                },
                {
                    $project: {month: {$month: "$createdAt"}}
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: 1}
                    }
                }
            ]
        )

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
  })


export default userRouter;