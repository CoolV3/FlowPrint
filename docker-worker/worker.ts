import { exec } from "node:child_process"
import { io, Socket } from "socket.io-client"

/**
 * @param {string} stlPath - Stl Pfad
 * @param {string} profilePath - Profile Pfad
 */

const ServerURL = process.env.CENTRAL_SERVER_URL
const TOKEN = process.env.USER_TOKEN

console.log("Programm is starting.")

function BuildTunnel(): Socket {

    console.log("Trying to connect to server")

    const socket: Socket = io(ServerURL, {
        auth: {token: TOKEN },
        reconnection: true,
    })

    socket.on("connect", () => {
        console.log(`Yay connectet sucessfully. ${socket.id}` )
        socket.emit("worker_status", { status: "Ready", workerId: socket.id})
    })

    socket.on("disconnect", (reason) => {
        console.log("IMPORTANT: Tunnel disconnected")
    })

    socket.on("ping", (message, callback) => {
        console.log("Recived a ping from the Server")
        if (typeof callback === "function") {
            callback("Pong");
        }
    })

    socket.on("get_status", (callback) => {
        console.log("Server fragt nach Status. Antworte...");
        // Sende den Status direkt an den Request zurück
        callback({
            currentTask: "Idle",
            cpuTemp: 45 // Beispiel-Daten
        });
    });



    return socket;
}




function SliceModel(stlPath:string, profilePath:string) {
    const outputGcode = stlPath.replace(".stl", ".gcode")


    const sliceCommand:string = `orcaslicer --slice --gui false --output ${outputGcode} ${stlPath}`

    console.log("Startet Slicing Process")

    exec(sliceCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Slicing fehlgeschlagen: ${error.message}`);
            return;
        }
        console.log("Slicing abgeschlossen! G-Code erstellt.");

    });
}

const WorkerSocket = BuildTunnel();