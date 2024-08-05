import {Job} from "../models/job.model.js";
//admin

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experienceLevel ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Please enter all required fields to continue",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel,
      position,
      company: companyId,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "New Job Created",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminJobs = async (req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({createdBy:adminId});
        if(!jobs || jobs.length === 0){
            res.status(400).json({
                message:"No jobs found",
                success: false,
            })
        }
        return res.status(200).json({
            jobs,
            success: true,
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const getAdminJobById = async (req, res) =>{
    try {
         const adminId = req.id;    
        const jobId = req.params.id;
          const job = await Job.find({createdBy: adminId, _id : jobId});
          if (!job) {
            return res.status(400).json({
              message: "Job not found",
              success: false,
            });
          }
          return res.status(200).json({
            job,
            success: true,
          });
       
        
    } catch (error) {
        console.log(error);
        
    }
}
//students

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        {title: {$regex: keyword, $options: "i"}},

        {description: {$regex: keyword, $options: "i"}},
      ],
    };

    const jobs = await Job.find(query).populate({
        path:"company"
    }).sort({createdAt: -1});
    if (!jobs) {
      return res.status(404).json({
        messsage: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};



