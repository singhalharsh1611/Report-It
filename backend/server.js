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
import multer from "multer";

import http from "http";
import {Server} from "socket.io";
import { setIO } from "./config/socket.js";
import geminiRouter from "./routes/geminiRoute.js";

passportSetup();


const app = express();
const port = process.env.PORT;

app.use(express.json())

//creating http server for socket.io
const server = http.createServer(app);

//setup socket.io
export const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
    methods: ["GET", "POST"],
    credentials: true
  }
});

setIO(io);

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected: ", socket.id);
    })
})



app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
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
app.use('/api/users', userRouter); //for user management

app.use("/api/issue", issueRouter);

app.use('/api/admin', adminRouter); //for admins

app.use("/api/gemini", geminiRouter);

server.listen(port, () => {
    console.log(`server started on port :${port}`)
})

