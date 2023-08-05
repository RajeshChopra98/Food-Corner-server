import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = (req, res, next) =>{
    const token  = req.cookies["connect.sid"];

    if(!token){
        return next(new ErrorHandler("Sign in Again", 400));
    }

    next();
};


export const isAdmin = (req, res, next) => {
  const token = req.cookies["connect.sid"];

  if (req.user.role !== "admin") {
    return next(new ErrorHandler("UnAuthorized Access", 405));
  }

  next();
};