import express from "express";
import { getAdminJobs,postJob,getAllJobs,getJobById, getAdminJobById} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import roleBasedAccess from "../middlewares/roleBasedAccess.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getAllJobs);
router.route("/admin").post(isAuthenticated,roleBasedAccess(["recruiter"]),postJob);
router.route("/admin").get(isAuthenticated,roleBasedAccess(["recruiter"]), getAdminJobs);
router.route("/admin/:id").get(isAuthenticated, roleBasedAccess(["recruiter"]), getAdminJobById);

router.route("/:id").get(isAuthenticated,getJobById);

export default router;