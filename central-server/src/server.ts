import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";
import { startSocketHandler } from "./worker/socketHandler";
import { workerRouter } from "./worker/api_worker";
import {AuthRouter} from "./auth/api_auth";
import cors from "cors"
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit"


const app = express();

const ApiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 429,
        error: "Too many requests",
        message: "You have exceeded he rate Limit. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false

})

const AuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6,
    message: {
        error: "Too many auth requests",
        message: "Please wait 15 minutes before trying again"
    },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false
})

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(ApiRateLimiter)
app.use(cookieParser());
app.use(express.json())
const httpServer = createServer(app);



app.use("/api/worker", workerRouter);
app.use("/api/auth", AuthLimiter, AuthRouter)




const io = new Server(httpServer, {
    cors: { origin: "*", credentials: true },
    pingTimeout: 60000,
    pingInterval: 25000
});

startSocketHandler(io);


httpServer.listen(3000, () => {
    console.log(`Zentraler Server läuft auf http://localhost:3000`);
    console.log("___ FLOW-Print ___")
});