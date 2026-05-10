import {Server, Socket} from "socket.io"
import {TestDB} from "./database";

export const onlineWorkers = new Map<string, Socket>()
export function startSocketHandler(io: Server) {
    io.on("connection", (socket) => {
        console.log(`Neuer Client verbunden mit ID: ${socket.id}`);

        const token = socket.handshake.auth.token;
        const workerInfo = TestDB[token as keyof typeof TestDB];

        if (!workerInfo) {
            console.log("Falscher oder kein Token. Verbindung getrennt.");
            socket.disconnect();
            return;
        }

        onlineWorkers.set(token, socket)
        // Wir verknüpfen den Socket mit unserem Nutzer
        socket.data.userId = workerInfo.userId;
        socket.data.workerName = workerInfo.workerName;
        console.log(`Worker authentifiziert als: ${workerInfo.workerName}`);

        // Auf Events des Workers hören
        socket.on("worker_status", (payload) => {
            console.log(`Status von ${socket.data.workerName}: ${payload.status}`);
        });

        socket.on("disconnect", () => {
            console.log(`${socket.data.workerName} hat die Verbindung verloren.`);
            onlineWorkers.delete(token);
        });
    })
}