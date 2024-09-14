const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    // username : { ---> this is automatically handled by passport-local-mongoose, no need to add on our own
    //     type : String ---> this is automatically handled by passport-local-mongoose
    // },
    // password : String,
    email : {
        type : String,
        // required : true,
        // unique : true
    },
    googleId: {
        type: String,
        default : null,
        // unique : false
    },

    userType : {
        type : String,
        //predefined values
        enum : ["consumer", "retailer"], 
        default : "consumer"
    },
    cart : [
        {
            name : String,
            price : Number,
            img : String,
            //id of product
            id : mongoose.Schema.Types.ObjectId,
            
            count : {
                type : Number,
                default : 1,
                min : [1, "Quantity cannot be less than 1"]
            }
        }

    ],
    wishlist : [{
        name : String,
        price : Number,
        img : String,
        id : mongoose.Schema.Types.ObjectId
    }]
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;