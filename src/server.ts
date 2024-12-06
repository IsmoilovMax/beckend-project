import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";


mongoose
.
    connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("Mongo-Db connection okey");
        const PORT = process.env.PORT ?? 8080;
        app.listen(PORT, function() {
            console.info(`The server is running  successfull on port : ${PORT}`); 
            console.info(`Admin project on http://localhost:${PORT}/admin`)
        })
    }).catch((err) => console.log("ERROR on connection MONGODB"))