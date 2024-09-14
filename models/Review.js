const mongoose = require("mongoose")
const User = require("./User");

const reviewSchema = new mongoose.Schema({
    rating : Number,
    comment : String,
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"

    }
})
const Review = mongoose.model("Review", reviewSchema)
module.exports = Review