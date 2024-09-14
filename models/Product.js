const mongoose = require("mongoose")
const User = require("./User")
const productSchema = new mongoose.Schema({
    name : String,
    price : Number,
    img : String,
    desc : String,
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        // required : true,
        

    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
})

const Product = mongoose.model("Product", productSchema)
module.exports = Product