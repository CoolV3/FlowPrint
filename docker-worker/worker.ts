import {exec} from "node:child_process"
import {io, Socket} from "socket.io-client"
import * as fs from "node:fs/promises";
import * as path from "node:path";

/**
 * @param {string} stlPath - Stl Pfad
 * @param {string} profilePath - Profile Pfad
 */

const ServerURL = process.env.CENTRAL_SERVER_URL
const TOKEN = process.env.USER_TOKEN
const OrcaSlicerApiUrl = "http://localhost:3000"
const FolderName = "./scadFiles"

interface ScadParameter {
    caption?: ""
    group?: string,
    initial: string,
    name: string,
    type: string
}

console.log("Programm is starting.")

function BuildTunnel(): Socket {

    console.log("Trying to connect to server")


    const socket: any = io(ServerURL as string, {
        auth: {token: TOKEN as string },
        reconnection: true,
    })

    socket.on("connect", () => {
        console.log(`Yay connectet sucessfully. ${socket.id}` )
        socket.emit("worker_status", { status: "Ready", workerId: socket.id})
    })

    socket.on("disconnect", () => {
        console.log("IMPORTANT: Tunnel disconnected")
    })

    socket.on("ping", (message: string, callback: any) => {
        console.log("Recived a ping from the Server")
        if (typeof callback === "function") {
            callback("Pong");
        }
    })

    socket.on("get_status", (callback: any) => {
        console.log("Server fragt nach Status. Antworte...");
        // Sende den Status direkt an den Request zurück
        callback({
            currentTask: "Idle",
            cpuTemp: 45 // Beispiel-Daten
        });
    });

    socket.on("uploadScadFile", async ( data: {scadContent: string, fileName: string }, callback: any) => {

        await SaveScadFile(data.scadContent, data.fileName)

        if (typeof callback === "function") {
            callback({ success: true, message: "Saved new Scad file from cloud successfully."});
        }
    })

    socket.on("listScadFiles", async (callback: any) => {
        const FolderName = "./scadFiles"
        console.log("Sending Files to server")

        try {
            await fs.mkdir(FolderName, {recursive: true})

            const allFiles =  await fs.readdir(FolderName)
            console.log(allFiles)

            if (typeof callback === "function") {
                callback({success: true, message: "Sucessfully fetched all Scad files", data: allFiles})
            }

        } catch(error) {
            if (typeof callback === "function") {
                callback({
                    success: false,
                    message: "Error during fetching Scad files",
                    error: error
                });
            }
        }
    })

    socket.on("getFileContents", async (fileId:string, callback: any) => {
        console.log("Sending file Contents to Server")

        try {
            const response = await GetFileContents(fileId)

            if (typeof callback == "function") {
                callback({
                    success: true,
                    message: `Sucessfully fetched file Contents from file ${fileId}`,
                    data: response
                })
            }
        } catch (error: any) {
            // HIER wird der Fehler abgefangen, anstatt den Container abstürzen zu lassen!
            if (typeof callback == "function") {
                callback({
                    success: false,
                    message: "File not found or cannot be read",
                    error: error.message
                })
            }
        }
    })

    socket.on("getScadValues", async (fileId: string, callback: any) => {
        const filePath = path.join(FolderName, fileId)
        const outputJsonPath = path.join(FolderName, `${fileId}.json`)

        console.log(`Extracting SCAD values for: ${fileId}`)

        const command = `xvfb-run -a openscad -o "${outputJsonPath}" --export-format param "${filePath}"`

        exec(command, async (error, stdout, stderr) => {
            try {
                if (error) {
                    console.error(`OpenSCAD Error: ${error.message}`)
                    return callback({ success: false, error: "OpenSCAD coudn´t extract the Values" });
                }


                const jsonRaw = await fs.readFile(outputJsonPath, "utf-8")
                const jsonData = JSON.parse(jsonRaw)


                await fs.unlink(outputJsonPath)

                callback({
                    success: true,
                    message: "Values extracted successfully",
                    data: jsonData
                });

            } catch (err: any) {

                if (error) {
                    console.error("Command:", command);
                    console.error("error.message:", error.message);
                    console.error("stdout:", stdout);
                    console.error("stderr:", stderr);
                    return callback({
                        success: false,
                        error: stderr || stdout || error.message
                    });
                }

            }
        });
    });

    socket.on("generatePrintPreview", async (fileId: string, customizedParameters: Record<string, string | number>, callback:any) => {
        const filePath = path.join(FolderName, fileId)
        const outputImagePath = path.join(FolderName, `${fileId}.png`)

        console.log(`Generating preview for File: ${fileId}`)

        const customParameterArgs = Object.entries(customizedParameters).map(([name, value]) => `-D '${name}="${value}"'`).join(" ")
        const command = `nice -n 15 xvfb-run -a openscad -o "${outputImagePath}" --imgsize=1024,1024 ${customParameterArgs} "${filePath}"`

        exec(command, async (error, stdout, stderr) => {
            try {
                if (error) {
                    console.error(`OpenSCAD Error: ${error.message}`)
                    return callback({ success: false, error: "OpenScad coudnt generate a preview picture." });
                }


                const ImageBuffer = await fs.readFile(outputImagePath)
                const base64 = ImageBuffer.toString("base64")


                await fs.unlink(outputImagePath)

                callback({
                    success: true,
                    message: "Values extracted successfully",
                    data: base64
                });

            } catch (err: any) {

                if (error) {
                    console.error("Command:", command);
                    console.error("error.message:", error.message);
                    console.error("stdout:", stdout);
                    console.error("stderr:", stderr);
                    return callback({
                        success: false,
                        error: stderr || stdout || error.message
                    });
                }

            }
        });
    })


    return socket;
}



export function SliceModel(stlPath:string) {

}

async function SaveScadFile(FileContent: string, FileName:string) {
    const FolderName = "./scadFiles"

    try {
        await fs.mkdir(FolderName, {recursive: true})

        const filePath = path.join(FolderName, FileName)

        await fs.writeFile(filePath, FileContent, `utf-8`)
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

async function GetFileContents(fileId:string) {
    const FolderName = "./scadFiles"

    try {
        const filePath = path.join(FolderName, fileId)
        return await fs.readFile(filePath, "utf-8")
    } catch (error) {
        console.error("Error while getting file contents.")
        throw error
    }
}


BuildTunnel();
