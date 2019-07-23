import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./route/web";
import bodyParser from "body-parser";

let app = express();
// Connect to MongoDB
ConnectDB();

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Init all route
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server running on port: ${process.env.APP_PORT}`));