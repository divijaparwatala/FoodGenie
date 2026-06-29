const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Please enter the food name"],
        trim:true,
        maxLength:[100, "Food name cannot exceed 100 characters"]
    },
    price: {
        type:Number,
        requires: [true, "Please enter the food price"],
        maxLength: [5, "Food price cannot exceed 5 characters"],
        default: 0.0
    },
    description: {
        type:String,
        required: [true, "Please enter the food description"]
    },
    ratings: {
        type:Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type:String,
                required: true
            },
            url: {
                type:String,
                required: true
            }
        }
    ],
    menu: {
        type: mongoose.Schema.ObjectId,
        ref: "Menu"
    },
    stock: {
        type:Number,
        required: [true, "Please enter the remaining stock left"],
        maxLength: [5,"Food stock cannot exceed 5 characters"],
        default: 0
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    numOfReviews: {
        type:Number,
        default:0
    },
    reviews: [
        {
            name: {
                type:String,
                required: true
            },
            rating: {
                type:Number,
                required: true
            },
            Comment: {
                type:String,
                required: true
            }
        }
    ],
    createdAt: {
        type:Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("FoodItem",foodSchema);