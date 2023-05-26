const mongoose = require('mongoose');

// Schema for User
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    avatar:{
        type: String
    },
    resetLink:{
        type: String,
        default:''
    }
    
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;