import express from "express";
import ConnectDB from "./config/connectDB";
import initRoutes from "./route/web";

let app = express();
// Connect to MongoDB
ConnectDB();
// Config view engine
app.set("view engine", "ejs");
//Init all route
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server running on port: ${process.env.APP_PORT}`));