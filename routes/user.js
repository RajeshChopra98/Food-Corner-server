import  express  from "express";
import passport from "passport";
import { getAllUsers, getMyProfile , logout } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { getAdminStats } from "../controllers/userController.js";


const router = express.Router();

router.get("/googlelogin", passport.authenticate("google", {
    scope :["profile"],
    successRedirect : process.env.FRONTEND_URL
}));


router.get("/login", passport.authenticate("google"),{
    successRedirect : process.env.FRONTEND_URL,
});

router.get("/logout", logout);

router.get("/me", isAuthenticated ,getMyProfile);


// Admin Routes...
router.get("/admin/users",isAuthenticated, isAdmin, getAllUsers);

router.get("/admin/stats",isAuthenticated,isAdmin, getAdminStats);

export default router;