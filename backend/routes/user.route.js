import express from "express";
import {
  createUser,
  localLogin,
  logout,
  getNavbarInfo,
  checkLogin,
  getCSRF,
  getAllUsers,

} from "../controllers/user.controller.js";
const router = express.Router();

router
  .route("/user")
  .post(createUser)
  .get(getAllUsers)
router.route("/user/login").post(localLogin); // login

  
router.route("/user/logout").post(logout); // logout

router.route("/user/navbar").get(getNavbarInfo); // get navbar info

router.route("/user/check-login").get(checkLogin); // check if user login

router
  .route("/user/chatRooms/:userId")
router.route("/csrf-token").get(getCSRF);

export default router;
