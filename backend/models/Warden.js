import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const wardenSchema = new mongoose.Schema({

    id: mongoose.Schema.Types.ObjectId,

    name: { 
        type: String,
        required: true
     },

     emp_no: {
            type: String,
            required: true,
            unique: true
        },

    email:{
     type: String,
     required: true,
     unique: true
     },

     password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false,
    },

    phone: {
        type: String,
        minLength: [10, "Phone number must be 10 digits long"],
        required: true,
        unique: true
    },

    block_no : {
        type: String,
        required: true,
        unique: true
    },

    complaints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
        },
    ],

    role: {
        type: String,
        default: "warden", // Hard-coded default value
    },
});

//this run before save to incript password
wardenSchema.pre("save", async function (next) {
    if (this.isModified("password")){ //only encrypt password if it is modified
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

//userdefine method to match password with encrypted password (cheack at login time)
wardenSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//generate token for user using 
wardenSchema.methods.generateToken = async function () {
    return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET); //we pass payload and secret key
}



export const Warden = mongoose.model('Warden', wardenSchema);