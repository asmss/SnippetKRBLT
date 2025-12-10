const express = require("express");
const router = express.Router();
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const snippetRoutes = require("./routes/snippetRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
connectDB();

const app = express();

app.use(cors({
    origin:"*"
}));

app.use(express.json());

app.use("/api/users",userRoutes);
app.use("/api/snippets",snippetRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/",(req,res)=>{
    res.send("API ÇALIŞIYOR");
})
const PORT =process.env.PORT || 3000;

app.listen(PORT,"0.0.0.0",()=>{
     console.log("SERVER AKTİF PORT : ",PORT);
})

