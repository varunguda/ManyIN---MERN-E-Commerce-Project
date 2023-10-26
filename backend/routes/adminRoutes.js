import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import {
    deleteAnyUser,
    getAllSellersAndBuyers,
    getAnyUserDetails,
    setSellerMerit,
    updateUserRole
} from "../controllers/adminControllers.js";


const router = Router();

// ADMIN ROUTES

router.route("/admin").get(isAdmin, (req, res, next) => {
    return res.json({
        success: true,
        admin: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            is_seller: req.user.is_seller,
            is_admin: req.user.is_admin,
        }
    })
});

router.route("/admin/users/all").get( isAdmin, getAllSellersAndBuyers);

router.route("/admin/user/:id")
    .get(isAdmin, getAnyUserDetails)
    .put(isAdmin, updateUserRole)
    .delete(isAdmin, deleteAnyUser)

router.route("/admin/seller/merit/:id").put(isAdmin, setSellerMerit)


export default router
