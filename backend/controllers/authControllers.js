import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';
import sendToken from '../utils/sendToken.js';
import crypto from 'crypto';
import mongoose from 'mongoose';


// Register user
export const registerUser = catchAsyncErrors (async (req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({

        name, email, password
    });

    sendToken(user, 201, res);
});

// login user
export const loginUser = catchAsyncErrors (async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return new(new ErrorHandler('Wprowadź email i hasło', 400));
    }

    //znajdz uzytkownika w bazie danych
    const user = await User.findOne({email }).select("+password")

    if(!user) {
        return next(new ErrorHandler('Zły email lub hasło', 401));
    }

    //Sprawdz czy hasło jest poprawne

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Zły email lub hasło', 401));
    }

    sendToken(user, 200, res);
});

//wyloguj

export const logout = catchAsyncErrors (async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json ({
        message:"Wylogowano",
    });
});


// Zapomniane hasło  /api/password/forgot
export const forgotPassword = catchAsyncErrors (async (req, res, next) => {

    //znajdz uzytkownika w bazie danych
    const user = await User.findOne({email: req.body.email });
    if(!user) {
        return next(new ErrorHandler('Nie znaleziono użytkownika z podanym adresem email', 404));
    }

    //Pobierz token resetu hasła

    const resetToken = user.getResetPasswordToken();

    await user.save()

    //Stwórz url do resetu hasła

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
    await sendEmail({
        email: user.email,
        subject: 'Odzyskiwanie hasła Yerbato',
        message,
    });

    res.status(200).json({
        message: `Email został wysłany do: ${user.email}`,
    })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire= undefined;

        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
});

// reset hasła  /api/password/reset/:token
export const resetPassword = catchAsyncErrors (async (req, res, next) => {

    //Url Token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user) {
        return next(new ErrorHandler('Token resetu hasła nie jest prawidłowy albo wygasł', 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Hasła nie są takie same",400));
    }

    //Ustaw nowe hasło
    user.password = req.body.password

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire= undefined;

    await user.save();

    sendToken(user,200, res);
});


    //pobierz profil aktualnego użytkownika  /api/me

    export const getUserProfile = catchAsyncErrors(async ( req, res, next) => {
        const user= await User.findById(req?.user?._id);

        res.status(200).json({
            user,
        });
    });


        //zmień hasło  /api/password/update

        export const updatePassword = catchAsyncErrors(async ( req, res, next) => {
            const user= await User.findById(req?.user?._id).select('+password');

            //Sprawdź poprzednie hasło
            const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

            if(!isPasswordMatched){
                return next(new ErrorHandler("Stare hasło nie jest poprawne", 400));
            }

            user.password = req.body.password;
            user.save()
    
            res.status(200).json({
                success: true,
            });
        });

              //update user profile  /api/password/update

              export const updateProfile = catchAsyncErrors(async ( req, res, next) => {
                
                const newUserData = {
                    name: req.body.name,
                    email: req.body.email 
                }

                const user = await User.findByIdAndUpdate(req.user._id, newUserData, { 
                    new: true,
                });

                res.status(200).json({
                    user,
                });
            });

            //get all users  /api/admin/users

            export const allUsers = catchAsyncErrors(async ( req, res, next) => {
                
                const users = await User.find()

                res.status(200).json({
                    users,
                });
            });

            //get user details  /api/admin/users/:id

            export const getUserDetails = catchAsyncErrors(async ( req, res, next) => {
                
                const user = await User.findById(req.params.id);

                if(!user) {
                    return next( new ErrorHandler (`Nie znaleziono użytkownika o podanym id: ${req.params.id}`, 404 )
                    );
                }

                res.status(200).json({
                    user,
                });
            });


             //update user details  /api/admin/users/:id

             export const updateUser = catchAsyncErrors(async ( req, res, next) => {
                
                const newUserData = {
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                };

                const user = await User.findByIdAndUpdate(req.params.id, newUserData, { 
                    new: true,
                });

                res.status(200).json({
                    user,
                });
            });

             //usun uzytkownika  /api/admin/users/:id

             export const deleteUser = catchAsyncErrors(async ( req, res, next) => {
                
                const user = await User.findById(req.params.id);

                if(!user) {
                    return next( new ErrorHandler (`Nie znaleziono użytkownika o podanym id: ${req.params.id}`, 404 )
                    );
                }

                //TODO - Remove user avatar from cloudinary

                await user.deleteOne()

                res.status(200).json({
                    succes:true,
                });
            });