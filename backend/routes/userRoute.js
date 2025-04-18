import express from 'express';
 import { authMiddleware } from '../middleware/authMiddleware.js';
 import { changeUserRole, deleteUser, getAllUsers, getMe, verifyModerator } from '../controllers/userController.js';
 import { authorizeroles } from '../middleware/rolesMiddleware.js';
 
 const userRouter = express.Router();
 
 userRouter.get('/me', authMiddleware, getMe);  
 userRouter.get('/', authMiddleware, authorizeroles('admin'), getAllUsers); //only admin have this right
 userRouter.patch('/:id/role', authMiddleware, authorizeroles('admin'), changeUserRole);
 userRouter.delete('/:id', authMiddleware, authorizeroles('admin'), deleteUser);
 
 userRouter.patch('/:id/verify', authMiddleware, authorizeroles('admin'), verifyModerator); //only admin have this right to verify a new moderator
 
 export default userRouter;