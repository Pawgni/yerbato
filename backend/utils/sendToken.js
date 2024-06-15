// Stworzenie tokenu i zapisanie w ciaseczku

export default (user, statusCode, res) => {
    //stwórz jwt token
    const token = user.getJwtToken();

    //Opcje ciasteczek
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 600 * 1000
        ),
        httpOnly: true
    };

    console.log(options);

    res.status(statusCode).cookie("token", token, options).json({
        token,
    });
};