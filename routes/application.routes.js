import express from "express";
import { getAdminJobs,postJob,getAllJobs,getJobById, getAdminJobById} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import roleBasedAccess from "../middlewares/roleBasedAccess.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicaiton.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated,roleBasedAccess(["recruiter"]), getApplicants);
router.route("/status/:id/update").post(isAuthenticated,roleBasedAccess(["recruiter"]),updateStatus)
export default router;