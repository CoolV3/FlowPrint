import {prisma} from "../lib/prisma"
import {randomInt} from 'crypto';
import * as argon2 from 'argon2';
import jwt from "jsonwebtoken"
import "dotenv/config";

const jwt_secret = process.env.JWT_SECRET as string
if (!jwt_secret) {
    throw new Error("Fatal Error: Didnt get environment variable JWT_SECRET");
}

const hashPassword = async (passwordToHash: string) => {
    try {
        return await argon2.hash(passwordToHash, {
            type: argon2.argon2id
        })
    } catch(error) {
        console.log(`Error:  ${error}`)
    }

}
const checkPasswords = async (plainPassword:string, hashedPassword:string) => {
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch (error){
        console.log(`Error while comparing Passwords: ${error}`)
    }
}

async function CreateNewUser(email:string, password:string, Name:string) {

    try {
        const HashedPassword = await hashPassword(password)

        if (!HashedPassword) {
            return {success: false, error: "An Error while Hashing stepped by :("}
        }
        const NewUser = await prisma.user.create({
            data: {
                name: Name,
                email: email,
                password: HashedPassword,
                emailVerifyToken: randomInt(100000, 999999).toString(),
                token: ""
            }
        })
        console.log("Created a new User")
        return { success: true }

    } catch(error) {
        return { success: false, error: error }
    }

}

async function LogInUser(email:string, plainPassword:string) {
    const currentUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (!currentUser) {
        return {success: false, error: "False Email or Password"}
    }
    const hashedPassword = currentUser.password

    if (await checkPasswords(plainPassword, hashedPassword)) {
        const JWToken = jwt.sign(
            {
                userId: currentUser.userId,
                email: currentUser.email
            },
            jwt_secret,
            { expiresIn: "24h"}
        )
        return {success: true, jwt_token: JWToken}
    } else {
        return {success: false, error: "False Email or Password"}
    }

}

export { LogInUser, CreateNewUser }
