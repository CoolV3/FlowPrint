import { Router } from "express";
import {onlineWorkers} from "./socketHandler";
import {AuthMiddleware} from "../auth/api_auth";
import {AddNewWorker, UploadScadFileToWorker} from "./WorkerManager";
import {WorkerAuthMiddleware} from "./WorkerApiMiddleware";
import {Socket} from "socket.io";


export const workerRouter = Router();

workerRouter.get("/worker/:token/status", AuthMiddleware, async (req, res)=> {
    const token = req.params.token

    const workerSocket = onlineWorkers.get(token)

    if (!workerSocket) {
        return res.status(404).json({error: "Worker not found or not online"})
    }

    try {

        const statusResponse = await workerSocket.emitWithAck("get_status", { timeout: 5000 });

        res.json({ status: "Erfolg", workerData: statusResponse });
    } catch {
        // Tritt ein, wenn der Pi nach 5 Sekunden (Timeout) nicht antwortet
        res.status(404).json({ error: "Worker hat nicht geantwortet" });
    }
})

workerRouter.post("/ping/:token", async (req, res) => {
    const token = req.params.token
    const worker = onlineWorkers.get(token)
    console.log("Recieved API Request")

    try {
        const response = await worker?.timeout(2000).emitWithAck("ping", "hi")
        res.status(200).send(`Your Raspi successfully responded with message: ${response}`)
    } catch {
        res.status(400).send("Connection Timed Out")
    }
})

workerRouter.post("/create", AuthMiddleware, async (req, res) => {
    console.log("API!")
    const data = req.body
    const userId: number = (req as unknown as { user: { userId: number } }).user.userId

    try {
        const result = await AddNewWorker(data.displayName, userId)

        res.status(201).send({success:true, message:"New Worker successfully Created", workerCode: result})
    } catch {
        res.status(500).send({success:false, message: "An error ocounterd while creating the Worker"})
    }
})

workerRouter.post("/uploadscad", AuthMiddleware, WorkerAuthMiddleware, async (req, res) => {
    const {scadContent, fileName} = req.body
    const WorkerSocket = (req as any).workerSocket


    try {
        console.log("Uploading a file to worker")
        const result = await UploadScadFileToWorker(WorkerSocket, scadContent, fileName)
        res.status(201).send({success: true, message: result})
    } catch (error: any) {
        res.status(500).send({success: true, error: error.message})
    }
})

workerRouter.get("/allScadFiles/:workerId", AuthMiddleware, WorkerAuthMiddleware, async (req, res) => {
    const workerSocket = (req as any).workerSocket

    try {
        const fileList = await workerSocket.timeout(5000).emitWithAck("listScadFiles");

        res.status(200).json({ success: true, files: fileList });

    } catch (error) {

        res.status(504).json({ success: false, error: "Worker hasnt responeded in Time" });
    }
});

workerRouter.get("/detailScadFile/:workerId/:fileId", AuthMiddleware, WorkerAuthMiddleware, async (req, res) => {
    const workerSocket: Socket = (req as any).workerSocket
    const fileId = req.params.fileId

    try {
        const response = await workerSocket.timeout(5000).emitWithAck("getFileContents", fileId);
        res.status(200).json(response);
    } catch (error) {
        res.status(504).json({ success: false, error: "Worker hasnt responeded in Time" });
    }
    
})

workerRouter.get("/getScadValues/:workerId/:fileId", AuthMiddleware, WorkerAuthMiddleware, async (req, res) => {
    const fileId = req.params.fileId
    const workerSocket: Socket = (req as any).workerSocket
    console.log("Fetching scad values")
    try {
        const response = await workerSocket.emitWithAck("getScadValues", fileId)

        res.status(200).json(response)
    } catch(error) {
        res.status(504).json({ success: false, error: "Worker hasnt responeded in Time" });
    }

})

workerRouter.post("/generatePrintPreview", AuthMiddleware, WorkerAuthMiddleware, async (req, res) => {
    const {customizedParameters, fileName} = req.body
    const workerSocket = (req as any).workerSocket

    console.log("Generating print preview")

    try {
        const response = await workerSocket.emitWithAck("generatePrintPreview", fileName, customizedParameters)

        res.status(200).json(response)
    } catch(error) {
        res.status(504).json({ success: false, error: "Worker hasnt responeded in Time"});
    }

})



