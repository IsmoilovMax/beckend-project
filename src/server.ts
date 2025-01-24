import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import server from "./app";


// Подключение к MongoDB с использованием переменной среды MONGO_URL
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("MONGO-DB connectin succeed!");
        const PORT = process.env.PORT ?? 3003;
        server.listen(PORT, function() {
            
            console.info(`The server is running  successfull on port : ${PORT}`); 
            console.info(`Admin project on http://localhost:${PORT}`)
    });

    }).catch((err) => console.log("ERROR on connection MONGODB", err));