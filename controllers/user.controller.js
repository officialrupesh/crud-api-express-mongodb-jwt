import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) =>{
    try {
        const {fullname,email,phoneNumber,password,role }= req.body;
        const user = await User.findOne({email});
        const hashedPassword = await bcrypt.hash(password,10);

        if( !fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"Something is missing",
                success: false
            })
        }

        if(user) {
            return res.status(400).json({
                message:"User Already exists",
                success: false,
            })
        }

        await User.create({
          fullname,
          email,
          phoneNumber,
          password : hashedPassword,
          role,
        });
        
        return res.status(201).json({
            message:"Account Created Successfully",
            succes: true,
        })
    } catch (error) {
        console.log("Couldnot register",error);

    }

}


export const login = async (req, res) =>{
    try {
        const {email,password,role} = req.body;

        if(!email || !password || !role){
            return res.status(400).json({
                message:"Please enter all fields to login",
                success:false,
            })
        }
        let user =await User.findOne({email});
        const isPasswordMatch = await bcrypt.compare(password,user.password);

        if( !user || !isPasswordMatch){
            return res.status(400).json({
                message:"Email or Password didn't match",
                success: false,
            });
        };

        if(role !== user.role){
            return res.status(400).json({
                message:"User with this role doesnot exist",
                success: false
            })

        }

        const tokenData = {
            userId:user._id,
            role: user.role,

        }

        const token = jwt.sign(tokenData,process.env.SECRET_KEY, {expiresIn:'1d'});
       
        user = {
            _id: user._id,
            fullname: user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res
          .status(200)
          .cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: "strict",
          }).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success: true,
          })

        
    } catch (error) {
        console.log(error)
        
    }
}


export const logout = async (req,res) =>{
    try {
        return res.status(200).cookie("token","",{maxAge:"0"}).json({
            message:"Logged out successfully",
            success: true,
        })
    } catch (error) {
        console.log("Unable to logout",logout);
        
    }
}

export const updateProfile = async (req,res) =>{
    try {
        const {fullname, email,phoneNumber,bio,skills} = req.body;
        const file = req.file;
        // if(!fullname ||!email || !phoneNumber || !bio || !skills){
        //     return res.status(400).json({
        //         message:"Some input is missing",
        //         success: false,
        //     });
        // };
        // cloudinary   
        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        } 
        const userId = req.id; //middleware authentication.
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message: "User not found",
                status: false
            });
        };

        //updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        

        //resume later

        await user.save();
            user = {
              _id: user._id,
              fullname: user.fullname,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role,
              profile: user.profile,
            };
            return res.status(200).json({
                message:"Profile Updated successfully",
                user,
                status: true
            })

    } catch (error) {
        console.log(error)
    }
}