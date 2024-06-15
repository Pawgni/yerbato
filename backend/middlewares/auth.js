//Sprawdź czy użytkownik jest zaufany czy nie
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";

export const isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
      return next (new ErrorHandler('Zaloguj się żeby dostać się do zawartości', 401));  
    }

   const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});


//Autoryzuj role użytkownika

export const authorizeRoles = (...roles) => {
  return(req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next (new ErrorHandler(`Rola  (${req.user.role}) nie jest upoważniona do tych zasobów `, 403));  
    };
    next();
  };
};