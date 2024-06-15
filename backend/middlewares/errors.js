import ErrorHandler from "../utils/errorHandler.js";


export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || 'Internal Server Error'
    };

    //Handle invalid mongoose id error
    if(err.name ==="CastError") {
        const message = `resource not found. Invalid: ${err?.path}`;
        error = new ErrorHandler(message, 404);
    }

    //Handle validation error
    if(err.name ==="ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }

    //Handle  mongoose duplicate key error
    if(err.code ===11000) {
        const message = ` Wprowadzono zduplikowany ${Object.keys(err.keyValue)}`;
        error = new ErrorHandler(message, 400);
    }

    //Handle zły JWT error
    if(err.name ==="JsonWebTokenError") {
        const message = `JSON Web Token jest zły. Spróbuj ponownie`;
        error = new ErrorHandler(message, 400);
    }

    //Handle wygaśnięty JWT error
    if(err.name ==="TokenExpiredError") {
        const message = `JSON Web Token wygasł. Spróbuj ponownie`;
        error = new ErrorHandler(message, 400);
    }

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
        });
    }
    if(process.env.NODE_ENV === 'PRODUCTION') {
        res.status(error.statusCode).json({
            message: error.message,
        });
    }
};