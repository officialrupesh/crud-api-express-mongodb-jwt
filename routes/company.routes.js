import express from "express";
import { registerCompany,getCompany,getCompanyById,updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/").get(isAuthenticated, getCompany);
router.route("/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").post(isAuthenticated, updateCompany);

export default router;