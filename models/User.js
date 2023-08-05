import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : "String",
    photo : "String",
    googleId : {
        type : String,
        required : true,
        unique : true
    },
    role:{
        type : String,
        enum :["user", "admin"],
        default : "user"
    },
    createdAT :{
        type : Date,
        default : Date.now
    }
});


export const User = mongoose.model("User", userSchema);