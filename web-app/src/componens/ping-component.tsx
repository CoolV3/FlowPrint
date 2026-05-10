"use client";

import {useState} from "react";


export default function PingSection() {
    const [token, setToken] = useState("")

    const PingRaspi = async () => {
        if (!token) {
            return "Gib einen token"
        }

        try {
            const response = await fetch(`http://localhost:3000/api/ping/${token}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": "123456"
                },

            });
            if (response.ok) {
                const data = await response.json();
                console.log("Erfolg:", data);
                alert("Ping erfolgreich gesendet!");
            } else {
                console.error("Server meldet Fehler:", response.status);
                alert(`Fehler: Worker nicht gefunden oder offline. ${response.status}`);
            }

        } catch(error) {
            console.log(`Error: ${error}`)
        }
    }

    return(
        <div>
            <div className="flex flex-col gap-5">
                <input placeholder="Raspi Token" className="bg-yellow-500 text-black rounded-2xl p-2" onChange={(e) => setToken(e.target.value)}/>
                <button onClick={() => PingRaspi()} className="bg-amber-400 cursor-pointer rounded-2xl p-4 text-black text-2xl hover:bg-amber-300 transition-colors duration-500">Send Ping</button>
            </div>
        </div>
    )
}