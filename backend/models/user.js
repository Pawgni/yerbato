import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Wprowadź swoje imię"],
        maxLength: [30,"Twoje imię nie może zawierać więcej niż 30 znaków"],      
    },
    email: {
        type: String,
        required: [true, "Wprowadź swój adres email"],
        maxLength: [30, "Twój email nie może zawierać więcej niż 30 znaków"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Wprowadź hasło"],
        minLength: [5, "Twoje hasło musi zawierać minimum 5 znaków"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: { 
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps: true }
);

//szyfrowanie hasła
userSchema.pre('save', async function (next){
    if(!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
});

//JWT TOKEN
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_TIME
    });
};

//Porownaj hasła
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


//generuj hasło resetuj token

userSchema.methods.getResetPasswordToken = function () {
    //generuj token
    const resetToken=crypto.randomBytes(20).toString('hex');

    //ustaw do pola resetowania hasła
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');

    //ustaw czas wygaśnięcia tokena 
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken;
};

export default mongoose.model("User", userSchema);