
import { Schema, model } from "mongoose";
import { roles } from "../../src/middleware/auth.js";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    firstName: {
        type: String,
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    lastName: {
        type: String,
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    position: {
        type: String,

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    socialLinks: {
        type: []
    },
    role: {
        type: String,
        default: 'User',
        enum: [roles.Admin, roles.HR, roles.User]
    },
    active: {
        type: Boolean,
        default: false,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    code: { type: String, default: null },
    lastSeen: String,
    image: String,
    imagePublicId: String,
    age: String,
}, {
    timestamps: true
})


const userModel = model('User', userSchema)
export default userModel