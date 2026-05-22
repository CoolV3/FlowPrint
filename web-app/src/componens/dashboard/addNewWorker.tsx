"use client";

import LetterSwapText from "@/componens/animations/scrambleText";
import {useState} from "react";
import { Loader } from 'lucide-react';

export default function AddNewWorkerComponent() {
    const [displayName, setDisplayName] = useState("")
    const [paringCode, setParingCode] = useState("Error while fetching")
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [errorText, setErrorText] = useState("")

    const generateParingCode = async () => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:3000/api/worker/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    displayName: displayName
                }),
                credentials: "include"
            });
            const data = await response.json();

            if (data.success) {
                setParingCode(data.workerCode);
                setStep(2);
            } else {
                setErrorText(data.message || "Fehler beim Erstellen");
            }

        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }


    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center ">
                {/* min-h-[300px] und max-w-md hinzugefügt, damit sie die gleiche Form wie die Inhalts-Karten hält */}
                <div className="bg-white rounded-2xl p-10 w-full max-w-md min-h-75 min-w-75 flex items-center justify-center">
                    <Loader className="animate-spin size-20 text-black"/>
                </div>
            </div>
        )
    }


    return(
        <div className="h-screen flex items-center justify-center ">
            <div className="bg-white rounded-2xl p-10 w-full  ">
                {step == 1 && (
                    <div className="flex flex-col items-center gap-10">
                        <h1 className="text-black text-3xl">Add a new Worker</h1>
                        <div>
                            <p className="text-black">Worker Display Name</p>
                            <input onChange={(e) => setDisplayName(e.target.value)} placeholder="Constis Pi" className="text-black border-2 rounded-2xl p-2"/>
                        </div>
                        <button onClick={() => generateParingCode()} className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Generate Paring Code</button>
                    </div>
                    )}

                { step == 2 && (
                    <div className="flex flex-col items-center gap-10">
                        <h1 className="text-3xl text-black">Paring Code</h1>
                        <p className="text-black">Type the paring code into the Docker Compose file </p>
                        <div className="bg-amber-300 px-15 py-3 rounded-2xl text-black text-2xl">
                            <LetterSwapText label={paringCode} />
                        </div>
                        <button onClick={() => setStep(2)} className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Done</button>
                    </div>
                )}
                {errorText && (
                    <p className="text-red-500 p-4">{errorText}</p>
                )}
            </div>
        </div>
    )
}