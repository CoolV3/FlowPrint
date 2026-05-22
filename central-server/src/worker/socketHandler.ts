import {Server, Socket} from "socket.io"
import {prisma} from "../lib/prisma"

export const onlineWorkers = new Map<string, Socket>()
export function startSocketHandler(io: Server) {
    io.on("connection", async (socket) => {
        console.log(`Neuer Client verbunden mit ID: ${socket.id}`);

        const token = socket.handshake.auth.token as string | undefined;

        if (!token) {
            console.log("Kein Token übermittelt. Verbindung getrennt.");
            socket.disconnect();
            return;
        }

        let workerInfo;

        try {

            workerInfo = await prisma.clientWorker.findFirst({ where: { secureKey: token } });
        } catch (err) {
            console.error("Fehler beim Abfragen der DB für Worker-Token:", err);
            socket.disconnect();
            return;
        }

        if (!workerInfo) {
            console.log("Falscher oder kein Token. Verbindung getrennt.");
            socket.disconnect();
            return;
        }

        onlineWorkers.set(token, socket);

        socket.data.userId = workerInfo.userId;
        socket.data.workerName = workerInfo.friendlyName ?? `worker-${workerInfo.id}`;
        console.log(`Worker authentifiziert als: ${socket.data.workerName}`);


        socket.on("worker_status", (payload) => {
            console.log(`Status von ${socket.data.workerName}: ${payload.status}`);
        });

        socket.on("disconnect", () => {
            console.log(`${socket.data.workerName} hat die Verbindung verloren.`);
            onlineWorkers.delete(token);
        });
    });
}