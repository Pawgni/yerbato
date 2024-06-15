import mongoose from "mongoose";

export const connectDatabase = () => {

    let DB_URI ="";

    if(process.env.NODE_ENV === 'DEVELOPMENT') DB_URI = process.env.DB_LOCAL_URI;
    if(process.env.NODE_ENV === 'PRODUCTION') DB_URI = process.env.DB_URI;

    mongoose.connect(DB_URI).then((con) => {
        console.log(`Baza danych MongoDB została połączona z HOSTEM: ${con?.connection.host}`
        );
    });
};