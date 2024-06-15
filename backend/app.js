import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import cookieParser from "cookie-parser";

//Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
});

dotenv.config({path: "backend/config/config.env"});

// Połączenie z MongoDB
connectDatabase();

// Zwiększ limit rozmiaru dla danych JSON i URL-encoded body
app.use(express.json({ limit: '50mb' })); // Tutaj dodajesz limit dla JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // I dla URL-encoded

app.use(cookieParser());

// IMPORT wszystkich ścieżek
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";

app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);

// Użyj error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Serwer wystartował na porcie: ${process.env.PORT} w trybie: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
