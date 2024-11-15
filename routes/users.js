// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User } = require("../db.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");
const  { authMiddleware } = require("../middleware.js");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {    
    const { success } = signupBody.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    
    return res.status(201).json({
        msg : "User created successfully!"
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string(),
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
    });

    if(user && user.password!=req.body.password){
        return res.status(411).json({
            msg:"Invalid password"
        })
    }

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        return res.status(201).json({
            msg:"Sign-in Successfull",
            token: token
        })
    }
    else{
        res.status(411).json({
            message: "User not found , please sign-up"
        })
    }
})

module.exports = router;