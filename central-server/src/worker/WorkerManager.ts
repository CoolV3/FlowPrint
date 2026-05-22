import {prisma} from "../lib/prisma"
import "dotenv/config";
import crypto from 'crypto';
import {onlineWorkers} from "./socketHandler";
import {Socket} from "socket.io";

export async function AddNewWorker(displayName: string, UserId: number) {

     const newSecureKey = crypto.randomBytes(32).toString("base64url")

      try {
        const newWorker = await prisma.clientWorker.create({
          data: {
            friendlyName: displayName,
            secureKey: newSecureKey,
            user: {
              connect: {
                userId: UserId
              }
            }
          }
        });

        return newSecureKey
      } catch(error) {
        console.error("Datenbankfehler:", error);
        throw new Error("Datenbank konnte den Worker nicht anlegen");
      }

}

export async function UploadScadFileToWorker(workerSocket: Socket, scadFileContent: string, fileName:string) {

    const scadContent = scadFileContent
    const response = await workerSocket.timeout(6000).emitWithAck("uploadScadFile", {scadContent, fileName})
    return response
}


