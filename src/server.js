import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./route/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";

let app = express();
// Connect to MongoDB
ConnectDB();

// Config session
configSession(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//Enable flash message
app.use(connectFlash());

//Config passport
app.use(passport.initialize());
app.use(passport.session());

//Init all route
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server running on port: ${process.env.APP_PORT}`));