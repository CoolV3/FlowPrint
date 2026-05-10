import { Router } from "express";
import {onlineWorkers} from "./socketHandler";

export const router = Router();


function requireAuth(req: any, res: any, next: any) {

    const apiToken = req.headers["auth-token"];

    if (!apiToken || apiToken !== "123456") {
        return res.status(401).json({ error: "Nicht autorisiert" });
    }


    next();
}


router.get("/worker/:token/status", requireAuth, async (req, res)=> {
    const token = req.params.token

    const workerSocket = onlineWorkers.get(token)

    if (!workerSocket) {
        return res.status(404).json({error: "Worker not found or not online"})
    }

    try {

        const statusResponse = await workerSocket.emitWithAck("get_status", { timeout: 5000 });

        res.json({ status: "Erfolg", workerData: statusResponse });
    } catch (error) {
        // Tritt ein, wenn der Pi nach 5 Sekunden (Timeout) nicht antwortet
        res.status(404).json({ error: "Worker hat nicht geantwortet" });
    }
})

router.post("/ping/:token", async (req, res) => {
    const token = req.params.token
    const worker = onlineWorkers.get(token)
    console.log("Recieved API Request")

    try {
        const response = await worker?.timeout(2000).emitWithAck("ping", "hi")
        res.status(200).send(`Your Raspi successfully responded with message: ${response}`)
    } catch (error) {
        res.status(400).send("Connection Timed Out")
    }


})