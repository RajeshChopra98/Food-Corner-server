import app from "./app.js";
import { connectDB } from "./config/database.js";
import Razorpay from "razorpay";

app.get("/", (req, res, next) => {
  res.send("<h1>Working</h1>");
});



export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


connectDB();

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT + " in " + process.env.NODE_ENV + " mode" );
});
