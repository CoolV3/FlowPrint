import { Router } from "express";
import * as argon2 from 'argon2';
import { LogInUser, CreateNewUser } from "./useAuth"
export const AuthRouter = Router();
import jwt from "jsonwebtoken"

const jwt_secret = process.env.JWT_SECRET as string



function AuthMiddleware(req: any, res: any, next: any) {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "Error with Authorization Header"})
    }
    const token:string = authHeader.split(" ")[1]

    try {
        const decodedPayload = jwt.verify(token, jwt_secret)
        req.user = decodedPayload

        next();
    } catch(error) {
        return res.status(401).json({ error: "Token is not valid."})
    }


}

AuthRouter.post("/user/create", AuthMiddleware, (req, res) => {
    const data = req.body;

    CreateNewUser(data.email, data.password, data.name)

    res.status(201)
});

