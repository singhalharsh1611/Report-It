import jwt from "jsonwebtoken";
 
 export const authorizeroles = (...roles)=>{
     return (req, res, next)=>{
         if(!roles.includes(req.user.role)){
            // console.log(req.user.name);
             return res.status(403).json({ 
                 message: 'Forbidden: insufficient rights',
                 success:false 
             });
         }
         next();
     }
 }