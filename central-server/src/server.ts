import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { startSocketHandler } from "./socketHandler";
import { router } from "./api_worker";
import cors from "cors"

const app = express();
app.use(cors());
const httpServer = createServer(app);

// JSON-Body Parser für API Post Requests
app.use(express.json());

// Binde die API-Routen unter dem Pfad "/api" ein
app.use("/api", router);

// Socket.IO Server aufsetzen
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

// Socket-Logik aufrufen und io übergeben
startSocketHandler(io);


httpServer.listen(3000, () => {
    console.log(`Zentraler Server läuft auf http://localhost:3000`);
    console.log()
});