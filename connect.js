const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.MONGO_URL);
connect.then(() => {
    console.log("Database connected successfully");
})

.catch(() => {
    console.log("Cannot connect to databse");
});

const SigninSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("users", SigninSchema);

module.exports = collection;