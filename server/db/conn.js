require("dotenv").config(); // ✅ Ensure .env is loaded
const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Database connected successfully!");
}).catch((err) => console.error("MongoDB Connection Error:", err));
