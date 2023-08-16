import express, { urlencoded } from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";
import { connectPassport } from "./utils/provider.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

dotenv.config({
  path: "./config/config.env",
});


// Uing Middlewares...
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie:{
      secure: process.env.NODE_ENV === "development"? false : true,
      httpOnly: process.env.NODE_ENV === "development"? false : true,
      sameSite: process.env.NODE_ENV === "development"? false : "none",
      maxAge: 1000 * 60 * 60 * 24
    }
  }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({
    extended: true
}));


app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods : ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

app.enable("trust proxy");

connectPassport();

// Using Routes...
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);



// Using Error Middleware...

app.use(errorMiddleware);

export default app;
