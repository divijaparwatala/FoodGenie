const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 characters"],
        minLength: [4, "Your name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm your password"],
        validate: {
            validator: function(eL) {
                return eL === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, "Please enter a valid phone number"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        public_id: String,
        url: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true });

//hashing password before saving user
userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

//pass compare
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    }
    //to check if user changes password after the token was issued
userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

//custom method to generate password reset token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_TIME || "90d",
    });
}

module.exports = mongoose.model("User", userSchema);