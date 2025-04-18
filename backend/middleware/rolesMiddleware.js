import jwt from "jsonwebtoken";
 
 export const authorizeroles = (...roles)=>{
     return (req, res, next)=>{
         if(!roles.includes(req.user.role)){
             return res.status(403).json({ 
                 message: 'Forbidden: insufficient rights',
                 success:false 
             });
         }
         next();
     }
 }