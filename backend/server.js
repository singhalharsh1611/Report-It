import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./config/db.js";
import session from "express-session";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import issueRouter from "./routes/issueRouter.js";
import passport from "passport";
import passportSetup from "./config/passport.js";
passportSetup();


const app = express();
const port = process.env.PORT;

app.use(express.json())

app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:5173'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//connect MONGO DB
connectDB();

app.get('/', (req, res) => {
    res.send("Backend Working");
})


//api endpoints
app.use('/api/auth', authRouter); //for login-register
app.use('/api/users/', userRouter); //for user management

app.use('/api/users/', userRouter); //for user management
app.use("/api/issue", issueRouter);

app.use('/api/admin', adminRouter); //for admins



app.listen(port, () => {
    console.log(`server started on port :${port}`)
})

