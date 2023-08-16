import { Order } from "../models/Order.js";
import {instance} from "../server.js";
import crypto from "crypto";
import ErrorHandler from "../utils/ErrorHandler.js";
import {Payment} from "../models/Payment.js";

export const placeOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      taxCharges,
      shippingCharges,
      totalAmount,
    } = req.body;

    const user = req.user._id;

    const orderOptions = {
      user,
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      taxCharges,
      shippingCharges,
      totalAmount,
    };

    await Order.create(orderOptions);

    res.status(201).json({
      success: true,
      message: "Order placed successfully Via Cash On Delivery",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};





export const placeOrderOnline = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      taxCharges,
      shippingCharges,
      totalAmount,
    } = req.body;

    const user = req.user._id;

    const orderOptions = {
      user,
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      taxCharges,
      shippingCharges,
      totalAmount,
    };

    const options = {
      amount: Number(totalAmount)*100, 
      currency: "INR",
    };

    const order = instance.orders.create(options, async (err, order) =>{
      console.log(order);
    });

    res.status(201).json({
      success: true,
      order,
      orderOptions
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};



export const paymentVerification = async (req, res, next) => {

  try {
    
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature, orderOptions} = req.body;

    const signature = hmac_sha256(
      razorpay_order_id + "|" + razorpay_payment_id,
      process.env.RAZORPAY_API_SECRET
    );

    // const signature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body).digest("hex");


    const isAuthentic = signature === razorpay_signature;

    if(isAuthentic){
      const payment = await Payment.create({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });


      await Order.create({
        ...orderOptions,
        paidAT : new Date(Date.now()),
        paymentInfo : payment._id
      });

      res.status(201).json({
        success: true,
        message: `Order Placed Successfully. Payment ID: ${payment._id}`,
      });
    }

    else{
      return next(new ErrorHandler("Payment Failed", 400));
    }


  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message));
  }

};


export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate("user", "name");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message));
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const orderid = req.params.id;
    const orderDetails = await Order.findById(orderid).populate("user", "name");

    if (!orderDetails) return next(new Error("Order not found", 404));

    res.status(200).json({
      success: true,
      orderDetails,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message));
  }
};

export const AdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message));

  }
};

export const processOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return next(new Error("Order not found", 404));

    if (order.orderStatus === "Preparing") {
      order.orderStatus = "Shipped";
      
    } else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliveredAT = new Date(Date.now());

    } else if (order.orderStatus === "Delivered") {
      return next(new Error("Order Already Delivered", 400));
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message));

  }
};




