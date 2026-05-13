const router = require("express").Router();

const authController = require(
  "../controllers/auth.controller"
);

const auth = require(
  "../middleware/auth.middleware"
);

// REGISTER
router.post(
  "/register",
  authController.register
);

// LOGIN
router.post(
  "/login",
  authController.login
);

// GET CURRENT USER
router.get(
  "/me",
  auth,
  authController.getMe
);

module.exports = router;