import express from "express";
let { initUserAPIRoutes } = require("./route/userAPI");
let { initMovieAPIRoutes } = require("./route/movieAPI");
const { configViewEngine } = require("./config/viewEngine"); //import các config từ file viewEngine

let { connect } = require("./config/connectDB");
require("dotenv").config();
let bodyParser = require("body-parser");
import cors from "cors";

let app = express();
app.use(cors({ origin: true })); // dùng để cho phép nhiều tài nguyên khác nhau của một trang web có thể được truy vấn từ domain khác với domain của trang đó

let port = process.env.PORT || 6969;


//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));


//config template engine
configViewEngine(app);


//route
initUserAPIRoutes(app);
initMovieAPIRoutes(app)

//check connect db
connect();

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
