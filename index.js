// backend/index.js
const express = require('express');
const cors = require("cors");
const app = express();
app.use(express.json());
const rootRouter = require("./routes/users.js");
app.use(cors());

app.get("/" , (req , res)=>{
    res.status(201).json({
        msg:"Gaymanshu"
    })
})

app.use("/users" , rootRouter);

app.listen(1000);