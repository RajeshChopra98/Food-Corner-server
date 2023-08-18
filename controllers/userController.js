import { User } from "../models/User.js";
import {Order} from "../models/Order.js";

export const getMyProfile = (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.clearCookie("connect.sid", {
      secure:  true,
      httpOnly:  true,
      sameSite:  "none",
    });
    res.status(200).json({
      message: "User logged out successfully",
    });
  });
};


export const getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            users
        });        
    } catch (error) {
        console.log(error);
    }
};



export const getAdminStats = async (req, res, next) => {
  try {
    const userCounts = await User.countDocuments();
    const orders = await Order.find({});

    const PreparingOrder = orders.filter((order) => order.orderStatus === "Preparing");
    const ShippedOrder = orders.filter((order) => order.orderStatus === "Shipped");
    const DeliveredOrder = orders.filter((order) => order.orderStatus === "Delivered");


    let TotalIncome = 0;

    orders.forEach((item)=>{
      TotalIncome += item.totalAmount;
    });


    res.status(200).json({
      success: true,
      userCounts,
      ordersCount: {
        TotalOrders : orders.length,
        PreparingOrders: PreparingOrder.length,
        ShippedOrders: ShippedOrder.length,
        DeliveredOrders: DeliveredOrder.length,
      },
      TotalIncome,
    })

  } catch (error) {
    console.error(error.message);
  }
};