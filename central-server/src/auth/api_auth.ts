import { Router } from "express";
import { LogInUser, CreateNewUser } from "./useAuth";
export const AuthRouter = Router();
import jwt from "jsonwebtoken"

const jwt_secret = process.env.JWT_SECRET as string


function AuthMiddleware(req: any, res: any, next: any) {

    const token:string = req.cookies.bearer_token;

    if (!token) {
        return res.status(401).json({error: "Not Authorized. Try logging in First"})
    }


    try {
        const decodedPayload = jwt.verify(token, jwt_secret)
        req.user = decodedPayload
        next();
    } catch(error) {
        return res.status(401).json({ error: "Token is not valid."})
    }
}

AuthRouter.post("/user/register", async (req, res) => {
    const data = req.body;

    const result = await CreateNewUser(data.email, data.password, data.name)
    if (result.success) {
        console.log("Registerd successfully")
        res.status(201).json({ message: "User created" });
    } else {
        res.status(400).send({error: result.error})
    }
});

AuthRouter.post("/user/login", async (req, res) => {
    const data = req.body


    if (!data || !data.email || !data.password) {
        return res.status(400).send({ error: "Email und Passwort fehlen" });
    }

    const result = await LogInUser(data.email, data.password)

    if (result.success) {
        res.cookie("bearer_token", result.jwt_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION === "true",
            sameSite: "lax",
            maxAge: 3600000 * 24
        })
        res.status(200).send({ message: "Login Successfull" })
    } else {
        res.status(400).send({error: result.error})
    }

})

AuthRouter.get("/user/testjwt", AuthMiddleware, (req, res) => {
    res.send("Did work")
})

export {AuthMiddleware}

