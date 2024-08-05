const roleBasedAccess = (allowedRoles) => (req, res, next)=>{
    const {role} = req;

    if(!allowedRoles.includes(role)){
        return res.status(403).json({
            message:"Access Denied",
            success: false,
        })
    }
    next();
 
}

export default roleBasedAccess;