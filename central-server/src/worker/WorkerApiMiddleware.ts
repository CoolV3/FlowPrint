import { prisma } from "../lib/prisma"
import { onlineWorkers } from "./socketHandler";

export async function WorkerAuthMiddleware(req: any, res: any, next: any) {

    const workerId = req.params.workerId || req.body.workerId;
    const userId = req.user?.userId;

    if (!workerId || !userId) {
        return res.status(400).json({ error: "No WorkerId or UserId is there :(" });
    }

    try {

        const DBWorker = await prisma.clientWorker.findUnique({
            where: { id: parseInt(workerId) }
        });

        if (!DBWorker) {
            return res.status(404).json({ error: "Requestet Worker not found" });
        }

        if (DBWorker.userId !== Number(userId)) {
            return res.status(403).json({ error: "This isnt your Worker. Set up your own!" });
        }


        const currentWorker = onlineWorkers.get(DBWorker.secureKey);

        if (!currentWorker) {
            return res.status(503).json({ error: "Worker is offline. You cannot access offline Workers." });
        }

        req.workerSocket = currentWorker;

        next();
    } catch (error) {
        console.error("WorkerMiddleWare crashes:", error);
        res.status(500).json({ error: "500 on noooooooooooooooooooooooooooooooo!" });
    }
}